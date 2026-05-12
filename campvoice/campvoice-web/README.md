# CampVoice Web

CampVoice Web is the browser client for the CampVoice platform. It contains the marketing experience, student authentication flow, complaint submission flow, notifications, and admin-facing dashboard screens.

## Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- Zustand

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

The web app sends API requests through the Next.js proxy layer.

- `CAMPVOICE_API_PROXY_TARGET` should point to the backend host
- frontend requests use `/api/v1/*` and are forwarded to the backend

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run linting

## Main App Areas

- marketing pages
- student registration and login
- complaint creation and tracking
- notifications
- admin dashboard pages

## Deployment

This app is intended to be deployed on Vercel with the backend hosted separately.

## Related Docs

- [Main project README](../README.md)
- [Repository structure](../STRUCTURE.md)
