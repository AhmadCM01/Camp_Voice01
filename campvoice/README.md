# CampVoice

CampVoice is a student feedback and complaint tracking platform built for Ahmadu Bello University (ABU). It includes a FastAPI backend, a Next.js web client, and an Expo React Native mobile client.

## SDLC Approach

This project follows an Agile, iterative delivery style:

- core requirements were implemented in increments
- each increment was tested across UI, API, and database layers
- MVP functionality was prioritized before UX refinements

## Repository Layout

- `backend/` - FastAPI API, async SQLAlchemy models, Alembic migrations
- `campvoice-web/` - Next.js App Router web app
- `campvoice-mobile/` - Expo React Native mobile app

See [STRUCTURE.md](./STRUCTURE.md) for a high-level folder map.

## Features

- student registration and login by email or matric number
- complaint submission and tracking
- admin dashboard with search, filtering, status updates, and response notes
- notifications when complaints are attended to
- ABU faculty to department selector powered by the API
- login protection with rate limiting and account lockout controls

## Run Locally

### Backend

1. Create `backend/.env` from `backend/.env.example`.
2. Set `DATABASE_URL` to a working PostgreSQL database.
3. Run:

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Useful endpoints:

- API docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/v1/health`

### Web

```bash
cd campvoice-web
npm install
npm run dev
```

Open `http://localhost:3000`.

The web app proxies `/api/v1/*` requests to `CAMPVOICE_API_PROXY_TARGET`.

### Mobile

```bash
cd campvoice-mobile
npm install
npx expo start -c
```

API notes:

- Android emulator uses `http://10.0.2.2:8000/api/v1`
- physical devices should use your LAN IP through `EXPO_PUBLIC_API_URL`

## Deployment

The web app can be deployed on Vercel, while the backend should be hosted separately.

1. Deploy the backend to a platform such as Render, Railway, Fly.io, or similar.
2. Set `CAMPVOICE_API_PROXY_TARGET=https://<your-backend-host>` in Vercel.
3. Deploy `campvoice-web`.

## Mobile Distribution

Build and publish notes live in [campvoice-mobile/RELEASE.md](./campvoice-mobile/RELEASE.md).

When you have hosted mobile download links, configure:

- `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL`
- `NEXT_PUBLIC_IOS_DOWNLOAD_URL`
