from fastapi import APIRouter
from .auth import router as auth_router
from .admin_auth import router as admin_auth_router
from .complaints import router as complaints_router
from .admin import router as admin_router
from .notifications import router as notifications_router
from .meta import router as meta_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(admin_auth_router, prefix="/admin/auth", tags=["admin-auth"])
api_router.include_router(complaints_router, prefix="/complaints", tags=["complaints"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
api_router.include_router(notifications_router, prefix="/notifications", tags=["notifications"])
api_router.include_router(meta_router, prefix="/meta", tags=["meta"])
