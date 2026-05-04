from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, String, select
from fastapi import HTTPException, status
from typing import Optional, Dict, Any
from uuid import UUID

from app.models.complaint import Complaint, ComplaintHistory
from app.models.notification import Notification
from app.models.user import User
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate
from app.services.auth_service import generate_tracking_number
from app.services.email_service import send_complaint_received, send_status_update


def _norm(v: str | None) -> str:
    return (v or "").strip().lower()

async def create_complaint(db: AsyncSession, complaint_in: ComplaintCreate, user: User) -> Complaint:
    tracking_no = generate_tracking_number()
    db_complaint = Complaint(
        tracking_no=tracking_no,
        student_id=user.id,
        title=complaint_in.title,
        category=complaint_in.category,
        description=complaint_in.description,
        priority=complaint_in.priority,
        attachment_url=complaint_in.attachment_url,
        status="pending"
    )
    db.add(db_complaint)
    await db.commit()
    await db.refresh(db_complaint)

    result = await db.execute(select(User).filter(User.role.in_(["admin", "super_admin"])))
    admins = result.scalars().all()
    for admin in admins:
        if admin.role == "admin":
            if not _norm(admin.department) or _norm(admin.department) != _norm(user.department):
                continue
        notification = Notification(
            user_id=admin.id,
            complaint_id=db_complaint.id,
            title="New Complaint Submitted",
            message=f"A new complaint ({tracking_no}) was filed in {db_complaint.category}."
        )
        db.add(notification)
    await db.commit()

    # Send email asynchronously
    send_complaint_received(user.email, tracking_no, db_complaint.title)

    return db_complaint

async def get_student_complaints(db: AsyncSession, user_id: str, page: int = 1, per_page: int = 20, status_filter: str = None, category_filter: str = None) -> Dict[str, Any]:
    query = select(Complaint).filter(Complaint.student_id == user_id)
    
    if status_filter:
        query = query.filter(Complaint.status == status_filter)
    if category_filter:
        query = query.filter(Complaint.category == category_filter)

    total_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = total_result.scalar_one()

    query = query.order_by(Complaint.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }

async def update_complaint_status(db: AsyncSession, complaint_id: str, admin_user: User, update_data: ComplaintUpdate) -> Complaint:
    try:
        complaint_uuid = UUID(str(complaint_id))
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid complaint id", headers={"code": "BAD_ID"})

    result = await db.execute(select(Complaint).filter(Complaint.id == complaint_uuid))
    complaint = result.scalars().first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found", headers={"code": "NOT_FOUND"})

    old_status = complaint.status
    if update_data.status:
        complaint.status = update_data.status
    if update_data.admin_response:
        complaint.admin_response = update_data.admin_response
    if update_data.internal_notes:
        complaint.internal_notes = update_data.internal_notes
    if update_data.assigned_to:
        complaint.assigned_to = update_data.assigned_to
    if update_data.priority:
        complaint.priority = update_data.priority

    history = ComplaintHistory(
        complaint_id=complaint.id,
        changed_by=admin_user.id,
        old_status=old_status,
        new_status=complaint.status,
        note=update_data.internal_notes or update_data.admin_response
    )
    db.add(history)

    # create notification for student
    student_result = await db.execute(select(User).filter(User.id == complaint.student_id))
    student = student_result.scalars().first()

    if admin_user.role == "admin":
        if not _norm(admin_user.department):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin department is not configured", headers={"code": "ADMIN_DEPARTMENT_REQUIRED"})
        if _norm(student.department) != _norm(admin_user.department):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed for this department", headers={"code": "DEPARTMENT_FORBIDDEN"})

    notification = Notification(
        user_id=complaint.student_id,
        complaint_id=complaint.id,
        title="Complaint Status Updated",
        message=f"Your complaint ({complaint.tracking_no}) is now {complaint.status}."
    )
    db.add(notification)
    
    await db.commit()
    await db.refresh(complaint)

    attended_statuses = {"in_progress", "resolved"}
    if (old_status != complaint.status and complaint.status in attended_statuses) or update_data.admin_response:
        send_status_update(student.email, complaint.tracking_no, old_status, complaint.status, complaint.admin_response)

    return complaint
