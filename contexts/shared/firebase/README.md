# Shared Firebase (web client)

- **`web-config.ts`** — `FirebaseOptions` from `NEXT_PUBLIC_*` env vars (no `initializeApp`).
- **`web-app.ts`** — singleton `getFirebaseWebApp()` (client-only).

Feature modules (e.g. `user-management/auth`) implement their own ports against this app instance.
