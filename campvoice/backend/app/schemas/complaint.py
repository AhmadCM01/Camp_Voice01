from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class ComplaintCreate(BaseModel):
    title: str = Field(..., max_length=100)
    category: str
    description: str = Field(..., min_length=20)
    priority: str = "normal"
    attachment_url: Optional[str] = None

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    admin_response: Optional[str] = None
    internal_notes: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[UUID] = None

class ComplaintHistoryResponse(BaseModel):
    id: UUID
    complaint_id: UUID
    changed_by_name: str
    old_status: Optional[str]
    new_status: Optional[str]
    note: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ComplaintResponse(BaseModel):
    id: UUID
    tracking_no: str
    student_id: UUID
    student_name: str
    title: str
    category: str
    description: str
    status: str
    priority: str
    assigned_to: Optional[UUID]
    assigned_admin_name: Optional[str]
    admin_response: Optional[str]
    internal_notes: Optional[str]
    attachment_url: Optional[str]
    resolved_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    history: Optional[List[ComplaintHistoryResponse]] = []

    class Config:
        from_attributes = True

class ComplaintListResponse(BaseModel):
    id: UUID
    tracking_no: str
    title: str
    category: str
    status: str
    priority: str
    admin_response: Optional[str] = None
    attachment_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaginatedComplaints(BaseModel):
    items: List[ComplaintListResponse]
    total: int
    page: int
    per_page: int
    pages: int
