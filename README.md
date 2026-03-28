# Nico Split

TanStack Start app with a frontend in `src/` and a local SQLite-backed backend in `backend/`.

## Local backend

- The backend uses TanStack Start server functions plus SQLite via `better-sqlite3`.
- The database file is created automatically at `data/nico-split.db`.
- Seed data is inserted on first run so the current screens still work without manual setup.
- The Vite scripts run through Node so Better Auth and SQLite work correctly even when you launch them with `bun run`.

## Authentication

- Auth is powered by Better Auth and mounted at `/api/auth/*`.
- Google sign-in is required before the app routes render.
- Copy `.env.example` to `.env` and set:
  - `BETTER_AUTH_URL`
  - `BETTER_AUTH_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- For local Google OAuth, add this redirect URI in Google Cloud:
  - `http://localhost:3000/api/auth/callback/google`

## Commands

- Install dependencies: `bun install`
- Start the app: `bun run dev`
- Build for production: `bun run build`
