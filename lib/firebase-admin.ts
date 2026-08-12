import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseProjectId } from "@/lib/firebase-project-id";

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) return getApps()[0]!;

  const projectId = getFirebaseProjectId();

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson) as Record<string, string>;
    return initializeApp({
      credential: cert(serviceAccount),
      projectId,
    });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ projectId });
  }

  return initializeApp({ projectId });
}

export async function verifyFirebaseIdToken(idToken: string) {
  return getAuth(getFirebaseAdminApp()).verifyIdToken(idToken);
}
