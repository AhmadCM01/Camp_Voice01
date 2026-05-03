from sqlalchemy import Column, String, Boolean, DateTime, Integer, Uuid
import uuid
from datetime import datetime, timezone
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    matric_no = Column(String(20), unique=True, nullable=True)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    department = Column(String(255), nullable=True)
    faculty = Column(String(255), nullable=True)
    level = Column(String(10), nullable=True)
    role = Column(String(20), nullable=False, default="student")
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    failed_login_attempts = Column(Integer, nullable=False, default=0)
    locked_until = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    @property
    def is_admin(self) -> bool:
        return self.role in ["admin", "super_admin"]

    def __repr__(self):
        return f"<User {self.email}>"
