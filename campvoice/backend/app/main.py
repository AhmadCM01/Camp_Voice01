import socket

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.exc import OperationalError

from app.config import settings
from app.routers import api_router

from contextlib import asynccontextmanager

# Rate limiter — keyed by client IP
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("CampVoice starting up...")
    yield
    print("CampVoice shutting down...")

app = FastAPI(
    title="CampVoice API",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan,
)

# Attach rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Middleware ──────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)
app.add_middleware(GZipMiddleware, minimum_size=500)

# Security headers on every response
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled Exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong. Please try again later.", "code": "SERVER_ERROR"}
    )


@app.exception_handler(OperationalError)
async def sqlalchemy_operational_error_handler(request: Request, exc: OperationalError):
    print(f"Database OperationalError: {exc}")
    return JSONResponse(
        status_code=503,
        content={
            "detail": "Database connection failed. Check DATABASE_URL and database availability.",
            "code": "DB_CONNECTION_FAILED",
        },
    )


@app.exception_handler(socket.gaierror)
async def dns_error_handler(request: Request, exc: socket.gaierror):
    print(f"DNS error: {exc}")
    return JSONResponse(
        status_code=503,
        content={
            "detail": "Network/DNS error while connecting to a dependency. Check DATABASE_URL host and internet connectivity.",
            "code": "DEPENDENCY_DNS_ERROR",
        },
    )


try:
    import asyncpg

    async def _asyncpg_exception_handler(request: Request, exc: Exception):
        print(f"asyncpg error: {exc}")
        return JSONResponse(
            status_code=503,
            content={
                "detail": "Database connection failed. Check DATABASE_URL and database availability.",
                "code": "DB_CONNECTION_FAILED",
            },
        )

    app.add_exception_handler(asyncpg.exceptions.PostgresError, _asyncpg_exception_handler)
    app.add_exception_handler(asyncpg.exceptions.InterfaceError, _asyncpg_exception_handler)
except Exception:
    pass

app.include_router(api_router, prefix="/api/v1")

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
