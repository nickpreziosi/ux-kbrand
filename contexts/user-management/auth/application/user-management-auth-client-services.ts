"use client";

import { authGateway } from "@/contexts/user-management/auth/infrastructure/auth-gateway";
import { AuthSessionService } from "@/contexts/user-management/auth/application/services/auth-session-service";
import { SignInWithEmailPasswordService } from "@/contexts/user-management/auth/application/services/sign-in-with-email-password-service";
import { clearPresenceSession, setPresenceSession } from "@/lib/auth/presence-session-client";

export const authSessionService = new AuthSessionService(authGateway, clearPresenceSession);

export const signInWithEmailPasswordService = new SignInWithEmailPasswordService(
  authGateway,
  setPresenceSession
);
