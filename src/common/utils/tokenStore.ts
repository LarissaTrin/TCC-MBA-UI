/**
 * Module-level token cache.
 *
 * BaseLayout keeps this in sync via useEffect whenever the NextAuth session
 * changes. apiClient reads from here synchronously — eliminating the
 * GET /api/auth/session HTTP round trip that getSession() makes before
 * every single request.
 */
let token: string | null = null;

export function setAuthToken(t: string | null | undefined) {
  token = t ?? null;
}

export function getAuthToken(): string | null {
  return token;
}
