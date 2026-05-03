from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import uuid
from datetime import datetime, timezone, timedelta

from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest
from app.utils.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.utils.eligibility import validate_comp_eng_eligibility
from app.config import settings
from app.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def check_duplicate_user(db: AsyncSession, email: str, matric_no: str = None):
    # Check email
    result = await db.execute(select(User).filter(User.email == email))
    if result.scalars().first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered", headers={"code": "EMAIL_EXISTS"})

    # Check matric_no if provided
    if matric_no:
        result = await db.execute(select(User).filter(User.matric_no == matric_no))
        if result.scalars().first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Matric number already registered", headers={"code": "MATRIC_EXISTS"})

async def register_user(db: AsyncSession, user_data: RegisterRequest) -> User:
    await check_duplicate_user(db, user_data.email, user_data.matric_no)

    new_user = User(
        email=user_data.email,
        matric_no=user_data.matric_no,
        full_name=user_data.full_name,
        department=user_data.department,
        faculty=user_data.faculty,
        level=user_data.level,
        password_hash=hash_password(user_data.password),
        role="student"
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

async def authenticate_user(db: AsyncSession, identifier: str, password: str) -> User:
    # Check if identifier is email or matric_no
    result = await db.execute(
        select(User).filter((User.email == identifier) | (User.matric_no == identifier))
    )
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials", headers={"code": "INVALID_CREDENTIALS"})

    now = datetime.now(timezone.utc)
    if user.locked_until and user.locked_until > now:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please try again later.",
            headers={"code": "LOGIN_LOCKED"},
        )
    if not verify_password(password, user.password_hash):
        user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
        if user.failed_login_attempts >= 5:
            user.locked_until = now + timedelta(minutes=15)
            user.failed_login_attempts = 0
        await db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials", headers={"code": "INVALID_CREDENTIALS"})

    if user.failed_login_attempts or user.locked_until:
        user.failed_login_attempts = 0
        user.locked_until = None
        await db.commit()
    if user.role == "student":
        try:
            validate_comp_eng_eligibility(
                matric_no=user.matric_no or "",
                level=user.level or "",
                department=user.department or "",
                faculty=user.faculty or "",
            )
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e), headers={"code": "NOT_ELIGIBLE"})
    return user

async def get_current_user(request: Request, db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    # Try header first, then cookie
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated", headers={"code": "NOT_AUTHENTICATED"})

    # if coming from cookie, remove Bearer prefix if exists
    if token.startswith("Bearer "):
        token = token[7:]

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token", headers={"code": "INVALID_TOKEN"})
        user_id = uuid.UUID(user_id_str)
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"code": "INVALID_CREDENTIALS"})

    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found", headers={"code": "USER_NOT_FOUND"})
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user", headers={"code": "USER_INACTIVE"})
    
    return user

async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges", headers={"code": "FORBIDDEN"})
    return current_user

def generate_tracking_number() -> str:
    year = datetime.now().year
    # In a real app, you might want to fetch the max ID in a transaction. 
    # For MVP, a random 6-digit or UUID substring can work temporarily or we use a sequence.
    random_id = str(uuid.uuid4().int)[:6]
    return f"CV-{year}-{random_id.zfill(6)}"
