import asyncio
import os
import sys

from sqlalchemy.future import select

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import SessionLocal
from app.models.user import User


async def main():
    email = (sys.argv[1] if len(sys.argv) > 1 else "ahmadyeruwa2008@gmail.com").strip().lower()
    async with SessionLocal() as db:
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalars().first()
        if not user:
            raise SystemExit(f"User not found: {email}")
        user.role = "super_admin"
        await db.commit()
        print(f"Promoted to super_admin: {email}")


if __name__ == "__main__":
    asyncio.run(main())
