import resend
from app.config import settings

resend.api_key = settings.RESEND_API_KEY

def _email_enabled() -> bool:
    return bool(settings.RESEND_API_KEY and settings.RESEND_API_KEY not in ("", "re_placeholder"))

def send_complaint_received(student_email: str, tracking_no: str, title: str):
    if not _email_enabled():
        print(f"[email no-op] Complaint received notification skipped (no Resend key). tracking_no={tracking_no}")
        return
    html_content = f"""
    <div style="font-family: Arial, sans-serif; color: #4B5320;">
        <h2>CampVoice: Complaint Received</h2>
        <p>Your voice matters. We have successfully received your complaint.</p>
        <p><strong>Tracking Number:</strong> {tracking_no}</p>
        <p><strong>Title:</strong> {title}</p>
        <p>We will notify you once the status changes.</p>
    </div>
    """
    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": [student_email],
            "subject": f"Complaint Received - {tracking_no}",
            "html": html_content
        })
    except Exception as e:
        print(f"Error sending email: {e}")

def send_status_update(student_email: str, tracking_no: str, old_status: str, new_status: str, admin_response: str):
    if not _email_enabled():
        print(f"[email no-op] Status update notification skipped (no Resend key). tracking_no={tracking_no}")
        return
    html_content = f"""
    <div style="font-family: Arial, sans-serif; color: #4B5320;">
        <h2>CampVoice: Complaint Status Updated</h2>
        <p>Your complaint ({tracking_no}) status has been updated to <strong>{new_status}</strong>.</p>
        <p><strong>Official Response:</strong></p>
        <blockquote style="border-left: 4px solid #6B7A3A; padding-left: 10px; color: #3A4118;">
            {admin_response or "No additional remarks."}
        </blockquote>
    </div>
    """
    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": [student_email],
            "subject": f"Status Update: {tracking_no}",
            "html": html_content
        })
    except Exception as e:
        print(f"Error sending email: {e}")

def send_password_reset(email: str, reset_token: str, reset_url: str):
    if not _email_enabled():
        print(f"[email no-op] Password reset email skipped (no Resend key). email={email}")
        return
    html_content = f"""
    <div style="font-family: Arial, sans-serif; color: #4B5320;">
        <h2>CampVoice: Password Reset</h2>
        <p>We received a request to reset your password.</p>
        <p>Click <a href="{reset_url}?token={reset_token}">here</a> to reset it.</p>
        <p>If you didn't request this, you can ignore this email.</p>
    </div>
    """
    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": [email],
            "subject": "Password Reset",
            "html": html_content
        })
    except Exception as e:
        print(f"Error sending email: {e}")
