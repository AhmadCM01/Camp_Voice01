# CampVoice Repository

CampVoice is a multi-platform student feedback and complaint management system built for Ahmadu Bello University (ABU). This repository contains the backend API, web application, and mobile application in one workspace.

## SDLC Approach

This project follows an Agile, iterative delivery style:

- core requirements were implemented in increments
- each increment was tested across UI, API, and database layers
- MVP functionality was prioritized before UX refinements

## Repository Overview

- `campvoice/backend` - FastAPI backend with SQLAlchemy, Alembic, and PostgreSQL/Supabase support
- `campvoice/campvoice-web` - Next.js web client for students and administrators
- `campvoice/campvoice-mobile` - Expo React Native mobile app
- `.github/workflows` - GitHub Actions automation for Android builds

## What The Project Does

CampVoice helps students:

- submit complaints or feedback
- track complaint progress
- receive response notifications
- use the platform from either web or mobile

## Stack

- Backend: FastAPI, SQLAlchemy, Alembic, PostgreSQL
- Web: Next.js, TypeScript, Tailwind CSS
- Mobile: Expo, React Native, TypeScript

## Quick Start

### Backend

```bash
cd campvoice/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Web

```bash
cd campvoice/campvoice-web
npm install
npm run dev
```

### Mobile

```bash
cd campvoice/campvoice-mobile
npm install
npx expo start -c
```

## Documentation

- Main project guide: [`campvoice/README.md`](./campvoice/README.md)
- Repository structure: [`campvoice/STRUCTURE.md`](./campvoice/STRUCTURE.md)
- Backend setup: [`campvoice/backend/README.md`](./campvoice/backend/README.md)
- Web setup: [`campvoice/campvoice-web/README.md`](./campvoice/campvoice-web/README.md)
- Mobile release notes: [`campvoice/campvoice-mobile/RELEASE.md`](./campvoice/campvoice-mobile/RELEASE.md)

## GitHub Repository

The configured `origin` remote points to:

- [AhmadCM01/Camp_Voice01](https://github.com/AhmadCM01/Camp_Voice01)
