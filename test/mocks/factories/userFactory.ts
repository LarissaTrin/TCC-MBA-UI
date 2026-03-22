import type { User, UserProfile } from "@/common/model/user";

let _idCounter = 1;

export function buildUser(overrides: Partial<User> = {}): User {
  const id = overrides.id ?? _idCounter++;
  return {
    id,
    firstName: "Test",
    lastName: `User${id}`,
    email: `user${id}@example.com`,
    ...overrides,
  };
}

export function buildUserProfile(
  overrides: Partial<UserProfile> = {}
): UserProfile {
  const id = overrides.id ?? _idCounter++;
  return {
    id,
    firstName: "Test",
    lastName: `User${id}`,
    username: `testuser${id}`,
    email: `user${id}@example.com`,
    ...overrides,
  };
}
