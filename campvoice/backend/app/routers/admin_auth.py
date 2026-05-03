from fastapi import APIRouter, Depends, Response, status, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import authenticate_user
from app.utils.security import create_access_token, create_refresh_token
from app.config import settings


router = APIRouter()


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    is_prod = settings.ENVIRONMENT == "production"
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        samesite="lax",
        secure=is_prod,
        max_age=900,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        secure=is_prod,
        max_age=604800,
    )


@router.post("/login", response_model=TokenResponse)
async def admin_login(
    request: Request,
    login_data: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    user = await authenticate_user(db, login_data.identifier, login_data.password)
    if user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin account required", headers={"code": "ADMIN_REQUIRED"})

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    _set_auth_cookies(response, access_token, refresh_token)
    return {"access_token": access_token, "token_type": "bearer", "user": user}
