import asyncio
import os
import sys

from sqlalchemy.future import select

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import SessionLocal
from app.models.user import User
from app.utils.security import hash_password


async def upsert_user(
    *,
    email: str,
    password: str,
    role: str,
    full_name: str,
    matric_no: str | None = None,
    department: str | None = None,
    faculty: str | None = None,
    level: str | None = None,
):
    normalized_email = email.strip().lower()
    async with SessionLocal() as db:
        result = await db.execute(select(User).filter(User.email == normalized_email))
        user = result.scalars().first()
        if not user and matric_no:
            result = await db.execute(select(User).filter(User.matric_no == matric_no))
            user = result.scalars().first()
        if not user:
            user = User(
                email=normalized_email,
                full_name=full_name,
                matric_no=matric_no,
                department=department,
                faculty=faculty,
                level=level,
                role=role,
                password_hash=hash_password(password),
                is_active=True,
            )
            db.add(user)
        else:
            user.full_name = full_name
            user.matric_no = matric_no
            user.department = department
            user.faculty = faculty
            user.level = level
            user.role = role
            user.password_hash = hash_password(password)
            user.is_active = True
        await db.commit()
        await db.refresh(user)
        return user


async def main():
    if os.environ.get("CAMPVOICE_DEV_RESET_DB") == "1":
        db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "campvoice.db"))
        if os.path.exists(db_path):
            os.remove(db_path)
        os.system("alembic upgrade head")

    student_email = os.environ.get("CAMPVOICE_DEV_STUDENT_EMAIL", "student@example.com")
    admin_email = os.environ.get("CAMPVOICE_DEV_ADMIN_EMAIL", "admin@example.com")
    password = os.environ.get("CAMPVOICE_DEV_PASSWORD", "Password1")

    student = await upsert_user(
        email=student_email,
        password=password,
        role="student",
        full_name="Dev Student",
        matric_no="U21CO1234",
        department="Computer Engineering",
        faculty="Faculty of Engineering",
        level="400",
    )
    admin = await upsert_user(
        email=admin_email,
        password=password,
        role="super_admin",
        full_name="Dev Super Admin",
    )

    print("Seeded accounts")
    print(f"STUDENT_EMAIL={student.email}")
    print(f"ADMIN_EMAIL={admin.email}")
    print(f"PASSWORD={password}")
    print(f"STUDENT_ID={student.id}")
    print(f"ADMIN_ID={admin.id}")


if __name__ == "__main__":
    asyncio.run(main())
