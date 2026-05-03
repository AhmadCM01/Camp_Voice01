import asyncio

from sqlalchemy import text

from app.database import engine


async def main() -> None:
    async with engine.connect() as conn:
        await conn.execute(text("select 1"))
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
