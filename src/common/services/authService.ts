/**
 * Auth service — runs server-side inside NextAuth callbacks.
 * Uses direct fetch with API_BASE_URL (server-only env variable).
 */

const API_URL = process.env.API_BASE_URL || "http://localhost:8000/api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  accessToken?: string;
}

interface TokenDataResponse {
  accessToken: string;
  expiresAt: string;
  userId: number;
  firstName: string;
  lastName: string;
}

/**
 * Authenticate user with email and password.
 * Backend uses OAuth2PasswordRequestForm (form-encoded, "username" field).
 */
export async function login(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!res.ok) return null;

  const data: TokenDataResponse = await res.json();

  return {
    id: String(data.userId),
    email,
    name: `${data.firstName} ${data.lastName}`,
    accessToken: data.accessToken,
  };
}

/**
 * Request password reset email.
 * POST /api/users/forgot-password
 */
export async function forgotPassword(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Falha ao enviar email de redefinição de senha.");
  }
}

/**
 * Reset password using a JWT token (from the email link).
 * POST /api/users/reset-password with Authorization header.
 */
export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/users/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword: password }),
  });

  if (!res.ok) {
    throw new Error("Falha ao redefinir senha.");
  }
}

/**
 * Validate an access token by trying to fetch the current user.
 * GET /api/users/user with Authorization header.
 */
export async function validateToken(accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/users/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
