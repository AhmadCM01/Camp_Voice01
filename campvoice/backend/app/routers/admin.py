from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, or_
from uuid import UUID

from app.database import get_db
from app.models.user import User
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintUpdate, ComplaintResponse
from app.schemas.admin import AdminCreateRequest, AdminUpdateRequest, AdminUserResponse
from app.services.auth_service import get_current_admin
from app.services.complaint_service import update_complaint_status
from app.utils.security import hash_password

router = APIRouter()

@router.get("/complaints")
async def get_all_complaints(
    page: int = 1,
    per_page: int = 20,
    status: str = None,
    category: str = None,
    priority: str = None,
    search: str = None,
    admin_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    safe_page = max(1, page)
    safe_per_page = min(max(1, per_page), 100)

    query = (
        select(Complaint, User.full_name)
        .join(User, User.id == Complaint.student_id)
    )

    if admin_user.role == "admin":
        if not (admin_user.department or "").strip():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin department is not configured", headers={"code": "ADMIN_DEPARTMENT_REQUIRED"})
        query = query.filter(func.lower(User.department) == func.lower(admin_user.department))

    if status:
        query = query.filter(Complaint.status == status)
    if category:
        query = query.filter(Complaint.category == category)
    if priority:
        query = query.filter(Complaint.priority == priority)
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Complaint.title.ilike(s),
                Complaint.description.ilike(s),
                Complaint.tracking_no.ilike(s),
                User.full_name.ilike(s),
                User.email.ilike(s),
                User.matric_no.ilike(s),
            )
        )

    total_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = total_result.scalar_one()

    query = (
        query.order_by(Complaint.created_at.desc())
        .offset((safe_page - 1) * safe_per_page)
        .limit(safe_per_page)
    )
    result = await db.execute(query)
    rows = result.all()

    items = []
    for complaint, student_name in rows:
        items.append({
            "id": str(complaint.id),
            "tracking_no": complaint.tracking_no,
            "student_id": str(complaint.student_id),
            "student_name": student_name,
            "title": complaint.title,
            "category": complaint.category,
            "description": complaint.description,
            "status": complaint.status,
            "priority": complaint.priority,
            "assigned_to": str(complaint.assigned_to) if complaint.assigned_to else None,
            "created_at": complaint.created_at,
            "updated_at": complaint.updated_at,
        })

    pages = (total + safe_per_page - 1) // safe_per_page
    return {
        "items": items,
        "total": total,
        "page": safe_page,
        "per_page": safe_per_page,
        "pages": pages,
    }

@router.get("/complaints/{id}")
async def get_admin_complaint(id: UUID, admin_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Complaint).filter(Complaint.id == id))
    complaint = result.scalars().first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    
    # Here admin sees full data
    return {"id": complaint.id, "title": complaint.title, "status": complaint.status}

@router.patch("/complaints/{id}/status")
async def update_status(id: UUID, update_data: ComplaintUpdate, admin_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    updated_complaint = await update_complaint_status(db, str(id), admin_user, update_data)
    return {"status": updated_complaint.status}

@router.patch("/complaints/{id}/assign")
async def assign_complaint(id: UUID, update_data: ComplaintUpdate, admin_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    updated_complaint = await update_complaint_status(db, str(id), admin_user, update_data)
    return {"assigned_to": updated_complaint.assigned_to}

@router.post("/complaints/{id}/respond")
async def respond_complaint(id: UUID, update_data: ComplaintUpdate, admin_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    updated_complaint = await update_complaint_status(db, str(id), admin_user, update_data)
    return {"message": "Response sent"}

@router.get("/stats")
async def get_dashboard_stats(admin_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    base = select(func.count()).select_from(Complaint)
    if admin_user.role == "admin":
        if not (admin_user.department or "").strip():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin department is not configured", headers={"code": "ADMIN_DEPARTMENT_REQUIRED"})
        base = base.join(User, User.id == Complaint.student_id).filter(func.lower(User.department) == func.lower(admin_user.department))

    total_result = await db.execute(base)
    total = total_result.scalar_one()

    pending_result = await db.execute(base.where(Complaint.status == "pending"))
    pending = pending_result.scalar_one()

    in_progress_result = await db.execute(base.where(Complaint.status == "in_progress"))
    in_progress = in_progress_result.scalar_one()

    resolved_result = await db.execute(base.where(Complaint.status == "resolved"))
    resolved = resolved_result.scalar_one()

    rejected_result = await db.execute(base.where(Complaint.status == "rejected"))
    rejected = rejected_result.scalar_one()

    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "rejected": rejected,
    }

@router.get("/users")
async def list_users(admin_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    if admin_user.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Requires super_admin")
    return {"message": "List of users"}


@router.get("/admins")
async def list_admins(admin_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    if admin_user.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Requires super_admin")
    result = await db.execute(select(User).filter(User.role.in_(["admin", "super_admin"])).order_by(User.created_at.desc()))
    items = result.scalars().all()
    return {"items": [AdminUserResponse.model_validate(u) for u in items]}


@router.post("/admins", response_model=AdminUserResponse, status_code=status.HTTP_201_CREATED)
async def create_admin(payload: AdminCreateRequest, admin_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    if admin_user.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Requires super_admin")

    email = payload.email.strip().lower()
    existing = await db.execute(select(User).filter(User.email == email))
    if existing.scalars().first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered", headers={"code": "EMAIL_EXISTS"})

    new_user = User(
        email=email,
        full_name=payload.full_name.strip(),
        department=payload.department.strip(),
        faculty=None,
        level=None,
        matric_no=None,
        role="admin",
        password_hash=hash_password(payload.password),
        is_active=True,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return AdminUserResponse.model_validate(new_user)


@router.patch("/admins/{id}", response_model=AdminUserResponse)
async def update_admin(id: str, payload: AdminUpdateRequest, admin_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    if admin_user.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Requires super_admin")
    result = await db.execute(select(User).filter(User.id == id))
    target = result.scalars().first()
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if target.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Target is not an admin")

    if payload.full_name is not None:
        target.full_name = payload.full_name.strip()
    if payload.department is not None:
        target.department = payload.department.strip()
    if payload.is_active is not None:
        target.is_active = payload.is_active

    await db.commit()
    await db.refresh(target)
    return AdminUserResponse.model_validate(target)
