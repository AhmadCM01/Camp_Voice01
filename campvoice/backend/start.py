import asyncio
import os
import subprocess
import sys
import time


def _require_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


async def _probe_postgres(dsn: str) -> None:
    import asyncpg

    from sqlalchemy.engine.url import make_url
    import ssl

    url = make_url(dsn)
    sslmode = (url.query.get("sslmode") or "").lower() if url.query else ""
    host = (url.host or "").lower()

    ssl_ctx = None
    if sslmode not in {"disable", "allow"} and ("railway.internal" not in host):
        is_railway_public = (
            host.endswith(".railway.app")
            or (".railway.app" in host)
            or host.endswith(".rlwy.net")
            or (".rlwy.net" in host)
        )
        if os.getenv("ENVIRONMENT", "").lower() == "development" or is_railway_public:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            ssl_ctx = ctx
        else:
            ssl_ctx = ssl.create_default_context()

    conn = await asyncpg.connect(dsn=dsn, statement_cache_size=0, ssl=ssl_ctx)
    try:
        await conn.execute("select 1")
    finally:
        await conn.close()


def _normalize_asyncpg_dsn(url: str) -> str:
    dsn = url
    if dsn.startswith("postgresql+asyncpg://"):
        dsn = "postgresql://" + dsn[len("postgresql+asyncpg://") :]
    if dsn.startswith("postgres://"):
        dsn = "postgresql://" + dsn[len("postgres://") :]
    return dsn


def _wait_for_db(database_url: str) -> None:
    url = database_url.strip()
    if url.startswith("sqlite"):
        return

    dsn = _normalize_asyncpg_dsn(url)
    last_error: Exception | None = None
    for _ in range(45):
        try:
            asyncio.run(_probe_postgres(dsn))
            return
        except Exception as e:
            last_error = e
            print(f"Database not ready yet: {e}")
            time.sleep(2)

    raise RuntimeError(f"Database did not become ready: {last_error}")


def main() -> None:
    database_url = _require_env("DATABASE_URL")
    _require_env("SECRET_KEY")

    try:
        import bcrypt
        import passlib

        print(f"bcrypt={getattr(bcrypt, '__version__', 'unknown')}")
        print(f"passlib={getattr(passlib, '__version__', 'unknown')}")
    except Exception as e:
        print(f"version_check_failed={e}")

    _wait_for_db(database_url)

    subprocess.check_call(["alembic", "upgrade", "head"])

    port = os.getenv("PORT", "8000")
    os.execvp(
        "uvicorn",
        [
            "uvicorn",
            "app.main:app",
            "--host",
            "0.0.0.0",
            "--port",
            port,
        ],
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(str(e))
        sys.exit(1)
