import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config import settings
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.utils.security import hash_password


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _now() -> datetime:
    return datetime.now(timezone.utc)


async def create_password_reset_token(db: AsyncSession, user: User) -> str:
    await db.execute(delete(PasswordResetToken).where(PasswordResetToken.user_id == user.id))

    raw_token = secrets.token_urlsafe(48)
    token_hash = _hash_token(raw_token)
    expires_at = _now() + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)

    record = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        used_at=None,
    )
    db.add(record)
    await db.commit()
    return raw_token


async def reset_password_with_token(db: AsyncSession, token: str, new_password: str) -> None:
    token_hash = _hash_token(token)
    now = _now()

    result = await db.execute(
        select(PasswordResetToken).where(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None),
            PasswordResetToken.expires_at > now,
        )
    )
    record = result.scalars().first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
            headers={"code": "INVALID_RESET_TOKEN"},
        )

    result = await db.execute(select(User).where(User.id == record.user_id))
    user = result.scalars().first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
            headers={"code": "INVALID_RESET_TOKEN"},
        )

    user.password_hash = hash_password(new_password)
    record.used_at = now
    await db.commit()
