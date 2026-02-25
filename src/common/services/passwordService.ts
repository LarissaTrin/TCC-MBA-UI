import { apiClient } from "./apiClient";

/**
 * Request a password reset email.
 * POST /api/users/forgot-password
 */
export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post("/users/forgot-password", { email });
}

/**
 * Reset password using a JWT token from the email link.
 * POST /api/users/reset-password with the token as Bearer auth.
 */
export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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
