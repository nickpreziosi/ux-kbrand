/**
 * Minimal JSON fetch for the mock HTTP backend (/api routes). Error responses
 * carry `{ error: "<i18n key>" }`; the key is rethrown as the Error message so
 * existing hooks/views keep matching on it (same contract as the mock repos).
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface FetchJsonInit extends Omit<RequestInit, "body"> {
  /** Serialized as the JSON request body (sets Content-Type). */
  json?: unknown;
}

export async function fetchJson<T>(url: string, init: FetchJsonInit = {}): Promise<T> {
  const { json, headers, ...rest } = init;
  const res = await fetch(url, {
    ...rest,
    credentials: "include",
    headers: {
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(json !== undefined ? { body: JSON.stringify(json) } : {}),
  });

  if (!res.ok) {
    let key = "errors.api.requestFailed";
    try {
      const payload: unknown = await res.json();
      if (
        typeof payload === "object" &&
        payload !== null &&
        typeof (payload as { error?: unknown }).error === "string"
      ) {
        key = (payload as { error: string }).error;
      }
    } catch {
      // Non-JSON error body — keep the generic key.
    }
    throw new ApiError(key, res.status);
  }

  return (await res.json()) as T;
}
