from authlib.integrations.google import Google
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.services.auth_service import create_or_update_user
import uuid

google = Google(
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration'
)

async def get_google_auth_url():
    """Generate Google OAuth authorization URL"""
    redirect_uri = f"{settings.FRONTEND_URL}/auth/google/callback"
    return google.authorize_redirect(redirect_uri)

async def handle_google_callback(code: str, db: AsyncSession):
    """Handle Google OAuth callback"""
    try:
        # Exchange authorization code for access token
        token = google.authorize_access_token(code)
        
        # Get user info from Google
        user_info = google.parse_id_token(token.get('id_token'))
        
        if not user_info or not user_info.get('email'):
            raise HTTPException(
                status_code=400,
                detail="Failed to get user information from Google"
            )
        
        # Create or update user in database
        user_data = {
            'email': user_info['email'],
            'full_name': user_info.get('name', ''),
            'role': 'student',  # Default role for OAuth users
            'is_oauth': True,
            'oauth_provider': 'google'
        }
        
        user = await create_or_update_user(db, user_data)
        
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Google authentication failed: {str(e)}"
        )
