"use client";

/**
 * Tells the server to set the httpOnly presence cookie. The Firebase ID token
 * rides along so the session route can verify it server-side and derive the
 * viewer's email from the *verified* claims (see /api/auth/session).
 */
export async function setPresenceSession(idToken?: string): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    credentials: "include",
    ...(idToken
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: idToken }),
        }
      : {}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Session failed (${res.status})`);
  }
}

export async function clearPresenceSession(): Promise<void> {
  await fetch("/api/auth/session", {
    method: "DELETE",
    credentials: "include",
  });
}
