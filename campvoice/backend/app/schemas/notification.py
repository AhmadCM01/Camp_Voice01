from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    complaint_id: Optional[UUID]
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
