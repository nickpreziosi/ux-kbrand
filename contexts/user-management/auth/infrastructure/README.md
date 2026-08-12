# Auth — infrastructure

- **`firebase-auth-gateway.ts`** — implements `AuthGatewayPort` using Firebase Auth + `getFirebaseWebApp`.
- **`map-firebase-auth-error.ts`** — user-facing strings for Firebase `FirebaseError` codes.

Shared Firebase app bootstrap: `contexts/shared/firebase/`.
