from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    DIRECT_DATABASE_URL: str = ""  # Optional; used for Alembic migrations when set
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    RESEND_API_KEY: str = ""          # Optional; email sending no-ops if blank
    EMAIL_FROM: str = "CampVoice <noreply@campvoice.app>"
    SUPABASE_URL: str = ""            # Optional in dev (SQLite mode)
    SUPABASE_KEY: str = ""            # Optional in dev (SQLite mode)
    SUPABASE_SERVICE_ROLE_KEY: str = ""  # Required for Storage uploads
    SUPABASE_STORAGE_BUCKET: str = "campvoice-attachments"
    FRONTEND_URL: str = "http://localhost:3000"
    PASSWORD_RESET_PATH: str = "/reset-password"
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 60
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8081"
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    @field_validator("DATABASE_URL", "DIRECT_DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, v: str) -> str:
        if not v:
            return v
        url = str(v)
        if url.startswith("postgres://"):
            url = "postgresql://" + url[len("postgres://") :]
        if url.startswith("postgresql://") and not url.startswith("postgresql+"):
            url = "postgresql+asyncpg://" + url[len("postgresql://") :]
        return url

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
