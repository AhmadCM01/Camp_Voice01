import mimetypes
from dataclasses import dataclass
from uuid import UUID, uuid4

from fastapi import HTTPException, status
from supabase import create_client

from app.config import settings


@dataclass(frozen=True)
class UploadResult:
    public_url: str
    object_path: str


def _ensure_storage_config() -> None:
    if not settings.SUPABASE_URL:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Storage not configured", headers={"code": "STORAGE_NOT_CONFIGURED"})
    if not settings.SUPABASE_SERVICE_ROLE_KEY and not settings.SUPABASE_KEY:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Storage not configured", headers={"code": "STORAGE_NOT_CONFIGURED"})


def _bucket_name(bucket: object) -> str | None:
    if isinstance(bucket, dict):
        return bucket.get("name")
    return getattr(bucket, "name", None)


def _normalize_extension(filename: str | None, content_type: str | None) -> str:
    ext = ""
    if filename and "." in filename:
        ext = "." + filename.rsplit(".", 1)[1].lower()
    if ext in (".jpg", ".jpeg", ".png", ".webp"):
        return ext
    guessed = mimetypes.guess_extension(content_type or "") or ""
    if guessed.lower() in (".jpg", ".jpeg", ".png", ".webp"):
        return guessed.lower()
    return ".jpg"


def upload_complaint_attachment(*, complaint_id: UUID, user_id: UUID, content: bytes, filename: str | None, content_type: str | None) -> UploadResult:
    _ensure_storage_config()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file", headers={"code": "EMPTY_FILE"})
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large (max 5MB)", headers={"code": "FILE_TOO_LARGE"})
    if content_type and not content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only image uploads are allowed", headers={"code": "UNSUPPORTED_MEDIA"})

    ext = _normalize_extension(filename, content_type)
    object_path = f"complaints/{complaint_id}/{user_id}/{uuid4().hex}{ext}"

    supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
    client = create_client(settings.SUPABASE_URL, supabase_key)
    bucket = settings.SUPABASE_STORAGE_BUCKET

    try:
        if settings.SUPABASE_SERVICE_ROLE_KEY:
            buckets = client.storage.list_buckets()
            if not any(_bucket_name(b) == bucket for b in (buckets or [])):
                client.storage.create_bucket(bucket, options={"public": True})
    except Exception:
        pass

    try:
        client.storage.from_(bucket).upload(
            object_path,
            content,
            file_options={
                "content-type": content_type or "application/octet-stream",
                "upsert": "true",
            },
        )
        public_url = client.storage.from_(bucket).get_public_url(object_path)
        return UploadResult(public_url=public_url, object_path=object_path)
    except Exception:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Failed to upload attachment", headers={"code": "UPLOAD_FAILED"})
