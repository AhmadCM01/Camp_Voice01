import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context
import ssl
from sqlalchemy.engine.url import make_url

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

import sys
import os
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))
from app.config import settings
from app.database import Base
from app.models import user, complaint, notification, password_reset_token

target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = settings.DIRECT_DATABASE_URL or settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """In this scenario we need to create an Engine
    and associate a connection with the context.

    """

    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = settings.DIRECT_DATABASE_URL or settings.DATABASE_URL
    connect_args = {}
    if configuration["sqlalchemy.url"].startswith("postgresql+asyncpg://"):
        url = make_url(configuration["sqlalchemy.url"])
        sslmode = (url.query.get("sslmode") or "").lower() if url.query else ""
        host = (url.host or "").lower()
        use_ssl = sslmode not in {"disable", "allow"} and ("railway.internal" not in host)

        if use_ssl:
            if settings.ENVIRONMENT == "development":
                ctx = ssl.create_default_context()
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE
                connect_args = {"ssl": ctx}
            else:
                connect_args = {"ssl": ssl.create_default_context()}

        if url.host and "pooler.supabase.com" in url.host:
            connect_args["statement_cache_size"] = 0
    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args=connect_args,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""

    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
