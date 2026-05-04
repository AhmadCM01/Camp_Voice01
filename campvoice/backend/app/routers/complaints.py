from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Dict, Any
from uuid import UUID
import anyio

from app.database import get_db
from app.models.user import User
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintResponse, PaginatedComplaints
from app.services.auth_service import get_current_user
from app.services.complaint_service import create_complaint, get_student_complaints
from app.services.storage_service import upload_complaint_attachment

router = APIRouter()

@router.get("", response_model=PaginatedComplaints)
async def get_complaints(
    page: int = 1, 
    per_page: int = 20, 
    status: str = None, 
    category: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await get_student_complaints(db, current_user.id, page, per_page, status, category)

@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
async def submit_complaint(
    complaint_data: ComplaintCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_complaint = await create_complaint(db, complaint_data, current_user)
    
    # Needs joined loads of student and admin for complete response, 
    # but for simple creation, reloading with relationships or mock name is fine.
    
    # We fetch it again with student to satisfy the Response requirements
    # A full app uses joinedload. Here we just query user.
    student_name = current_user.full_name
    admin_name = None
    
    complaint_dict = {
        "id": new_complaint.id,
        "tracking_no": new_complaint.tracking_no,
        "student_id": new_complaint.student_id,
        "student_name": student_name,
        "title": new_complaint.title,
        "category": new_complaint.category,
        "description": new_complaint.description,
        "status": new_complaint.status,
        "priority": new_complaint.priority,
        "assigned_to": new_complaint.assigned_to,
        "assigned_admin_name": admin_name,
        "admin_response": new_complaint.admin_response,
        "internal_notes": new_complaint.internal_notes,
        "attachment_url": new_complaint.attachment_url,
        "resolved_at": new_complaint.resolved_at,
        "created_at": new_complaint.created_at,
        "updated_at": new_complaint.updated_at,
        "history": []
    }
    return complaint_dict

@router.get("/{id}", response_model=ComplaintResponse)
async def get_complaint(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Student can only view their own
    result = await db.execute(select(Complaint).filter(Complaint.id == id))
    complaint = result.scalars().first()
    
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found", headers={"code": "NOT_FOUND"})
    if complaint.student_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized", headers={"code": "FORBIDDEN"})
    
    # Assemble response (omitting joins for brevity, MVP)
    return {
        "id": complaint.id,
        "tracking_no": complaint.tracking_no,
        "student_id": complaint.student_id,
        "student_name": current_user.full_name,
        "title": complaint.title,
        "category": complaint.category,
        "description": complaint.description,
        "status": complaint.status,
        "priority": complaint.priority,
        "assigned_to": complaint.assigned_to,
        "assigned_admin_name": None,
        "admin_response": complaint.admin_response,
        "internal_notes": complaint.internal_notes,
        "attachment_url": complaint.attachment_url,
        "resolved_at": complaint.resolved_at,
        "created_at": complaint.created_at,
        "updated_at": complaint.updated_at,
        "history": []
    }

@router.get("/track/{tracking_no}")
async def track_complaint(
    tracking_no: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Complaint).filter(Complaint.tracking_no == tracking_no))
    complaint = result.scalars().first()
    if not complaint or complaint.student_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found", headers={"code": "NOT_FOUND"})
    return {
        "status": complaint.status,
        "id": complaint.id,
        "admin_response": complaint.admin_response,
        "attachment_url": complaint.attachment_url,
    }

@router.post("/{id}/attachment")
async def upload_attachment(
    id: UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Complaint).filter(Complaint.id == id))
    complaint = result.scalars().first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found", headers={"code": "NOT_FOUND"})
    if complaint.student_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized", headers={"code": "FORBIDDEN"})

    content = await file.read()
    upload = await anyio.to_thread.run_sync(
        lambda: upload_complaint_attachment(
            complaint_id=id,
            user_id=current_user.id,
            content=content,
            filename=file.filename,
            content_type=file.content_type,
        )
    )
    complaint.attachment_url = upload.public_url
    await db.commit()

    return {"attachment_url": upload.public_url}
