/**
 * Auth service — decoupled from NextAuth so it can be swapped to real API calls.
 *
 * To integrate with your Python API later, replace the mock implementations
 * with fetch calls to your backend (e.g., POST ${API_BASE_URL}/auth/login).
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  accessToken?: string;
}

const MOCK_CREDENTIALS = {
  email: "admin@email.com",
  password: "123456",
  user: {
    id: "1",
    email: "admin@email.com",
    name: "Admin User",
  },
};

/**
 * Authenticate user with email and password.
 * Returns the user object on success, null on failure.
 *
 * → Later: POST /api/auth/login to Python API
 */
export async function login(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock validation — replace with real API call
  if (
    email === MOCK_CREDENTIALS.email &&
    password === MOCK_CREDENTIALS.password
  ) {
    return {
      ...MOCK_CREDENTIALS.user,
      accessToken: "mock-jwt-token-" + Date.now(),
    };
  }

  return null;
}

/**
 * Request password reset email.
 *
 * → Later: POST /api/auth/forgot-password
 */
export async function forgotPassword(email: string): Promise<void> {
  console.log(`API: Solicitando reset de senha para: ${email}`);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("API: Email de reset enviado com sucesso (simulado).");
}

/**
 * Reset password using a temporary token.
 *
 * → Later: POST /api/auth/reset-password
 */
export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  console.log(`API: Redefinindo senha com token: ${token}`);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("API: Senha redefinida com sucesso (simulado).");
}

/**
 * Validate an access token against the backend.
 * Returns true if valid, false if expired/revoked.
 *
 * → Later: GET /api/auth/validate-token with Authorization header
 */
export async function validateToken(accessToken: string): Promise<boolean> {
  // Mock validation — replace with real API call
  // e.g. const res = await fetch(`${API_BASE_URL}/auth/validate-token`, {
  //   headers: { Authorization: `Bearer ${accessToken}` },
  // });
  // return res.ok;

  return accessToken.startsWith("mock-jwt-token-");
}
