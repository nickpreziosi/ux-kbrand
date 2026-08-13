"use client";

/**
 * Tells the server to set the httpOnly presence cookie (no token; no Firebase
 * on server). The signed-in email rides along so the mock HTTP backend can
 * resolve the viewer's portal role server-side.
 */
export async function setPresenceSession(email?: string): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    credentials: "include",
    ...(email
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
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
