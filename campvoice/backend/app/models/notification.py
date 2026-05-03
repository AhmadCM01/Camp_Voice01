from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime, timezone
from app.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    complaint_id = Column(Uuid(as_uuid=True), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="notifications")
