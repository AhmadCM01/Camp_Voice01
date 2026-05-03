# CampVoice Backend (FastAPI)

## Local dev

1. Create `.env` from `.env.example`.
2. Run migrations:

```bash
alembic upgrade head
```

3. Start the API:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

API base URL: `http://127.0.0.1:8000/api/v1`

## Notes

- The web app proxies `/api/v1/*` to this backend via Next.js rewrites.
- For production, use Postgres (Supabase) and set environment variables in your hosting provider (do not commit `.env`).
- Email sending uses Resend; set `RESEND_API_KEY` to enable outbound emails.

## Promote a user to super admin

After registering a user, you can promote them:

```bash
python scripts/promote_super_admin.py you@example.com
```
