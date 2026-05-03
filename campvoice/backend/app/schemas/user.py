from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str
    matric_no: Optional[str]
    department: Optional[str]
    faculty: Optional[str]
    level: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
