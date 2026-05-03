## CampVoice Web (Vercel) Deployment

### Required
- A running backend base URL (FastAPI) reachable from Vercel, e.g. `https://api.yourdomain.com`

### Environment Variables (Vercel Project)
- `CAMPVOICE_API_PROXY_TARGET` = `https://api.yourdomain.com`
- `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL` = direct APK URL (optional)
- `NEXT_PUBLIC_IOS_DOWNLOAD_URL` = direct iOS install URL (optional)

### Notes
- The web app proxies requests from `/api/v1/*` to `CAMPVOICE_API_PROXY_TARGET` via Next.js rewrites.
- If you change user roles (student/admin) directly in the database, log out and log in again so tokens refresh.

