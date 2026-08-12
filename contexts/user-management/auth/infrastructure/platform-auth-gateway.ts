"use client";

import type {
  AuthGatewayPort,
  AuthSessionState,
  AuthenticatedUser,
} from "@/contexts/user-management/auth/domain/auth-gateway.port";
import {
  claimsFromIdToken,
  getPlatformIdToken,
} from "@/lib/auth/platform-id-token";
import { shellLoginUrl } from "@/lib/platform-auth/safe-return-to";

function sessionStateFromPlatformToken(): AuthSessionState {
  const token = getPlatformIdToken();
  if (!token) {
    return { user: null, claims: null };
  }

  const decoded = claimsFromIdToken(token);
  if (!decoded) {
    return { user: null, claims: null };
  }

  const user: AuthenticatedUser = {
    uid: decoded.uid,
    email: decoded.email,
    displayName: decoded.displayName,
    photoUrl: null,
  };

  return { user, claims: null };
}

class PlatformAuthGateway implements AuthGatewayPort {
  async signInWithEmailAndPassword(_email: string, _password: string): Promise<void> {
    window.location.assign(shellLoginUrl());
  }

  async signOut(): Promise<void> {
    // Platform cookies are cleared by AuthProvider before signOutAndClearPresence.
  }

  subscribe(listener: (state: AuthSessionState) => void): () => void {
    const emit = () => listener(sessionStateFromPlatformToken());
    emit();

    const onFocus = () => emit();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }

  async refreshSessionClaims(): Promise<AuthSessionState> {
    return sessionStateFromPlatformToken();
  }

  async getIdToken(): Promise<string | null> {
    return getPlatformIdToken();
  }
}

export const platformAuthGateway: AuthGatewayPort = new PlatformAuthGateway();
