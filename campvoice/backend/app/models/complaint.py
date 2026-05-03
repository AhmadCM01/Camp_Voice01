from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime, timezone
from app.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tracking_no = Column(String(20), unique=True, nullable=False)
    student_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="pending")
    priority = Column(String(20), default="normal")
    assigned_to = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)
    admin_response = Column(Text, nullable=True)
    internal_notes = Column(Text, nullable=True)
    attachment_url = Column(String(500), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    student = relationship("User", foreign_keys=[student_id], backref="complaints")
    assigned_admin = relationship("User", foreign_keys=[assigned_to], backref="assigned_complaints")
    history = relationship("ComplaintHistory", back_populates="complaint", cascade="all, delete-orphan")

class ComplaintHistory(Base):
    __tablename__ = "complaint_history"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    complaint_id = Column(Uuid(as_uuid=True), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    changed_by = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    old_status = Column(String(30), nullable=True)
    new_status = Column(String(30), nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    complaint = relationship("Complaint", back_populates="history")
    user = relationship("User", foreign_keys=[changed_by])
