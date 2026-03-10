import { apiClient } from "./apiClient";
import { UserProfile } from "@/common/model";

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

/**
 * Register a new user.
 * POST /api/users/
 */
export async function register(data: RegisterData): Promise<void> {
  await apiClient.post("/users/", data);
}

interface UserApiResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

function mapUserProfile(u: UserApiResponse): UserProfile {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    username: u.username,
    email: u.email,
  };
}

/**
 * Fetch the current authenticated user's profile.
 * GET /api/users/user
 */
export async function getProfile(): Promise<UserProfile> {
  const data = await apiClient.get<UserApiResponse>("/users/user");
  return mapUserProfile(data);
}

/**
 * Update user profile fields.
 * PUT /api/users/{userId}
 */
export async function updateProfile(data: Partial<UserProfile>): Promise<void> {
  if (!data.id) throw new Error("User ID is required for profile update.");
  await apiClient.put(`/users/${data.id}`, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    username: data.username,
  });
}

/**
 * Update password for the current user.
 * POST /api/users/reset-password (requires auth)
 */
export async function updatePassword(data: {
  password?: string;
}): Promise<void> {
  if (!data.password) return;
  await apiClient.post("/users/reset-password", {
    newPassword: data.password,
  });
}

/**
 * Fetch notes for the current user.
 * GET /api/users/me/notes
 */
export async function getNotes(): Promise<string> {
  const data = await apiClient.get<{ notes: string }>("/users/me/notes");
  return data.notes ?? "";
}

/**
 * Save notes for the current user.
 * PUT /api/users/me/notes
 */
export async function saveNotes(notes: string): Promise<void> {
  await apiClient.put("/users/me/notes", { notes });
}
