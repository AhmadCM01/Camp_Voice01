# CampVoice

CampVoice is a student feedback and complaint tracking platform (Web + Mobile + API) built for Ahmadu Bello University (ABU). Students can submit complaints, track status, and receive updates when an admin attends to their complaint.

## SDLC Model Used

This project was built using an **Agile (Iterative/Incremental) SDLC approach**:

- Requirements were implemented in small increments (authentication, complaints, admin workflow, notifications).
- Each increment was tested end-to-end (UI → API → DB) and refined based on feedback.
- MVP scope was prioritized first, then UX improvements (design tokens, selectors, error handling) were layered on.

## Repository Layout

- `backend/` — FastAPI + async SQLAlchemy + Alembic migrations
- `campvoice-web/` — Next.js (App Router) web app
- `campvoice-mobile/` — Expo React Native mobile app

See [STRUCTURE.md](file:///c:/Users/USER/OneDrive/Documents/Camp_Voice/campvoice/STRUCTURE.md) for a clean folder map.

## Features

- Student registration & login (email or matric)
- Complaint submission & tracking
- Admin dashboard: search, filter, update status, add responses/notes
- Notifications created when complaints are attended to
  - Backend stores notifications in DB
  - Web: notifications page
  - Mobile: notifications screen
- ABU faculty → department selector
  - API provides directory at `GET /api/v1/meta/abu-directory`
  - Web & Mobile registration use it
- Login protection
  - Rate limits on auth endpoints (per IP)
  - Per-account lockout after repeated failed password attempts (migration required)

## Run Locally

### Backend (FastAPI)

1. Configure `backend/.env`:
   - `DATABASE_URL` must point to a working Postgres database.
   - If you use Supabase, copy the **exact connection string** from Supabase dashboard.

2. Run:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open:
- API docs: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/api/v1/health`

### Web (Next.js)

```bash
cd campvoice-web
npm install
npm run dev
```

Open `http://localhost:3000`.

The web app uses a Next.js proxy for API calls:
- Requests to `/api/v1/*` are forwarded to `CAMPVOICE_API_PROXY_TARGET`.

### Mobile (Expo)

```bash
cd campvoice-mobile
npm install
npx expo start -c
```

API base URL:
- Android emulator uses `http://10.0.2.2:8000/api/v1`
- Physical phone must use your machine LAN IP via `EXPO_PUBLIC_API_URL`

## Deploy (Vercel)

Web deployment is on Vercel, but the API must be hosted separately.

1. Deploy backend (Render/Fly/Railway/etc.)
2. Set Vercel env:
   - `CAMPVOICE_API_PROXY_TARGET=https://<your-backend-host>`
3. Deploy `campvoice-web` to Vercel.

## Mobile Downloads

Build and publish links are documented in [campvoice-mobile/RELEASE.md](file:///c:/Users/USER/OneDrive/Documents/Camp_Voice/campvoice/campvoice-mobile/RELEASE.md).

After you get a hosted APK/TestFlight link, set:
- `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL`
- `NEXT_PUBLIC_IOS_DOWNLOAD_URL`

