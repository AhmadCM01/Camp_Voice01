from fastapi import APIRouter

from app.utils.abu_directory import ABU_FACULTY_DEPARTMENTS

router = APIRouter()


@router.get("/abu-directory")
async def get_abu_directory():
    items = [
        {"faculty": faculty, "departments": departments}
        for faculty, departments in sorted(ABU_FACULTY_DEPARTMENTS.items(), key=lambda x: x[0].lower())
    ]
    return {"items": items}

