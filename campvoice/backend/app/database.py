from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.config import settings
import ssl
from sqlalchemy.engine.url import make_url

_connect_args = {}
if settings.DATABASE_URL.startswith("postgresql+asyncpg://"):
    url = make_url(settings.DATABASE_URL)
    sslmode = (url.query.get("sslmode") or "").lower() if url.query else ""
    host = (url.host or "").lower()
    use_ssl = sslmode not in {"disable", "allow"} and ("railway.internal" not in host)

    if use_ssl:
        if settings.ENVIRONMENT == "development":
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            _connect_args = {"ssl": ctx}
        else:
            _connect_args = {"ssl": ssl.create_default_context()}

    if url.host and "pooler.supabase.com" in url.host:
        _connect_args["statement_cache_size"] = 0

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=(settings.ENVIRONMENT == "development"),
    future=True,
    connect_args=_connect_args,
)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
