"use client";

import {
  getAuth,
  onAuthStateChanged,
  OAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseWebApp } from "@/contexts/shared/firebase/web-app";
import type {
  AuthGatewayPort,
  AuthSessionState,
  AuthenticatedUser,
} from "@/contexts/user-management/auth/domain/auth-gateway.port";
import { normalizeClaims } from "@/contexts/user-management/auth/domain/token-claims";
import { mapFirebaseAuthErrorToSignInError } from "@/contexts/user-management/auth/infrastructure/map-firebase-auth-error";

function toAuthenticatedUser(u: User | null): AuthenticatedUser | null {
  if (!u) return null;
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}

async function sessionStateFromUser(u: User | null): Promise<AuthSessionState> {
  const user = toAuthenticatedUser(u);
  if (!u) {
    return { user: null, claims: null };
  }
  const result = await u.getIdTokenResult();
  return {
    user,
    claims: normalizeClaims(result.claims as Record<string, unknown>),
  };
}

class FirebaseAuthGateway implements AuthGatewayPort {
  private get auth() {
    return getAuth(getFirebaseWebApp());
  }

  async signInWithMicrosoft(): Promise<void> {
    const provider = new OAuthProvider("microsoft.com");
    const tenantId = process.env.NEXT_PUBLIC_ENTRA_TENANT_ID;
    provider.setCustomParameters({
      // Routes straight to the K Lab login; the single-tenant app
      // registration in Entra is what actually enforces the boundary.
      ...(tenantId ? { tenant: tenantId } : {}),
      prompt: "select_account",
    });
    try {
      // Popup, not redirect: the app runs on a different domain than the
      // Firebase authDomain and signInWithRedirect is unreliable cross-origin
      // now that browsers block third-party cookies.
      await signInWithPopup(this.auth, provider);
    } catch (e) {
      throw mapFirebaseAuthErrorToSignInError(e);
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth);
  }

  subscribe(listener: (state: AuthSessionState) => void): () => void {
    return onAuthStateChanged(this.auth, async (u) => {
      try {
        listener(await sessionStateFromUser(u));
      } catch {
        // getIdTokenResult() can fail on first load before the token is cached.
        // Fall back to authenticated-but-no-claims so loading always resolves.
        listener({ user: toAuthenticatedUser(u), claims: null });
      }
    });
  }

  async refreshSessionClaims(): Promise<AuthSessionState> {
    return sessionStateFromUser(this.auth.currentUser);
  }

  async getIdToken(): Promise<string | null> {
    const u = this.auth.currentUser;
    if (!u) return null;
    return u.getIdToken();
  }
}

export const firebaseAuthGateway: AuthGatewayPort = new FirebaseAuthGateway();
