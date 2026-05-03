from fastapi import APIRouter, Depends, Response, status, Request, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from jose import JWTError, jwt
import uuid

from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.schemas.user import UserResponse
from app.services.auth_service import register_user, authenticate_user, get_current_user
from app.models.user import User
from app.utils.security import create_access_token, create_refresh_token
from app.config import settings
from app.services.password_reset_service import create_password_reset_token, reset_password_with_token
from app.services.email_service import send_password_reset

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

def _set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    is_prod = settings.ENVIRONMENT == "production"
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        samesite="lax",
        secure=is_prod,
        max_age=900,   # 15 minutes
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        secure=is_prod,
        max_age=604800,  # 7 days
    )

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(request: Request, user_data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new student user. Rate limited to 5 per minute per IP."""
    user = await register_user(db, user_data)
    return user

@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(request: Request, login_data: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    """Authenticate user and issue tokens. Rate limited to 10 per minute per IP."""
    user = await authenticate_user(db, login_data.identifier, login_data.password)
    if user.role in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins must sign in via the admin portal.",
            headers={"code": "ADMIN_LOGIN_REQUIRED"},
        )
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    _set_auth_cookies(response, access_token, refresh_token)
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("20/minute")
async def refresh_token(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    """Use the refresh token cookie to issue a new access token."""
    from sqlalchemy.future import select
    from app.models.user import User as UserModel

    token = request.cookies.get("refresh_token")
    if not token:
        from fastapi import HTTPException
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token provided")
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        if not user_id_str:
            raise ValueError("Bad token")
        user_id = uuid.UUID(user_id_str)
    except (JWTError, ValueError):
        from fastapi import HTTPException
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    from app.database import get_db as _get_db
    from app.services.auth_service import get_db as _get_db2

    result = await db.execute(select(UserModel).filter(UserModel.id == user_id))
    user = result.scalars().first()
    if not user or not user.is_active:
        from fastapi import HTTPException
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    new_access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    _set_auth_cookies(response, new_access_token, new_refresh_token)
    return {"access_token": new_access_token, "token_type": "bearer", "user": user}

@router.post("/forgot-password")
@limiter.limit("3/minute")
async def forgot_password(request: Request, data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    from sqlalchemy.future import select

    normalized = data.email.strip().lower()
    result = await db.execute(select(User).where(User.email == normalized))
    user = result.scalars().first()

    debug_token = None
    if user and user.is_active:
        token = await create_password_reset_token(db, user)
        reset_url = settings.FRONTEND_URL.rstrip("/") + settings.PASSWORD_RESET_PATH
        send_password_reset(email=user.email, reset_token=token, reset_url=reset_url)
        if settings.ENVIRONMENT == "development" and (not settings.RESEND_API_KEY or settings.RESEND_API_KEY in ("", "re_placeholder")):
            debug_token = token

    response = {"message": "If that email is registered, a reset link has been sent."}
    if debug_token:
        response["debug_token"] = debug_token
    return response

@router.post("/reset-password")
@limiter.limit("5/minute")
async def reset_password(request: Request, data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    await reset_password_with_token(db, token=data.token, new_password=data.new_password)
    return {"message": "Password has been reset successfully"}

@router.get("/google/login")
async def google_login():
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Google login is not enabled")

@router.get("/google/callback")
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Google login is not enabled")
