import re
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from typing import Optional
from .user import UserResponse
from app.utils.eligibility import validate_comp_eng_eligibility, normalize_level

PASSWORD_PATTERN = re.compile(
    r'^(?=.*[A-Z])(?=.*\d).{8,}$'
)

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    matric_no: str = Field(..., max_length=20)
    department: str = Field(..., min_length=2, max_length=100)
    faculty: str = Field(..., min_length=2, max_length=100)
    level: str = Field(..., min_length=2, max_length=20)
    password: str = Field(..., min_length=8)

    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not PASSWORD_PATTERN.match(v):
            raise ValueError(
                'Password must be at least 8 characters and contain '
                'at least one uppercase letter and one digit.'
            )
        return v

    @field_validator('full_name', 'department', 'faculty')
    @classmethod
    def strip_html(cls, v: str) -> str:
        # Strip any HTML/script injection attempts
        clean = re.sub(r'<[^>]+>', '', v).strip()
        return clean

    @field_validator('level')
    @classmethod
    def normalize_level_value(cls, v: str) -> str:
        return normalize_level(v)

    @model_validator(mode='after')
    def validate_program(self):
        validate_comp_eng_eligibility(
            matric_no=self.matric_no,
            level=self.level,
            department=self.department,
            faculty=self.faculty,
        )
        self.matric_no = self.matric_no.strip()
        return self

class LoginRequest(BaseModel):
    identifier: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=1)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

    @field_validator('new_password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not PASSWORD_PATTERN.match(v):
            raise ValueError(
                'Password must be at least 8 characters and contain '
                'at least one uppercase letter and one digit.'
            )
        return v
