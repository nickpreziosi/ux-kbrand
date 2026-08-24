"use client";

import { authGateway } from "@/contexts/user-management/auth/infrastructure/auth-gateway";
import { AuthSessionService } from "@/contexts/user-management/auth/application/services/auth-session-service";
import { SignInWithMicrosoftService } from "@/contexts/user-management/auth/application/services/sign-in-with-microsoft-service";
import { clearPresenceSession, setPresenceSession } from "@/lib/auth/presence-session-client";

export const authSessionService = new AuthSessionService(authGateway, clearPresenceSession);

export const signInWithMicrosoftService = new SignInWithMicrosoftService(
  authGateway,
  setPresenceSession
);
