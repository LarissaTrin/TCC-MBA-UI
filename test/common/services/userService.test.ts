/**
 * Tests for common/services/userService.ts
 */
import { http, HttpResponse } from "msw";
import { setupMswForTest } from "../../mocks/msw/setupMswForTest";
import { server } from "../../mocks/msw/server";
import {
  register,
  getProfile,
  updateProfile,
  updatePassword,
  getNotes,
  saveNotes,
} from "@/common/services/userService";
import { setAuthToken } from "@/common/utils/tokenStore";

setupMswForTest();

const BASE = "http://localhost:8000/api";

beforeEach(() => setAuthToken("token"));
afterEach(() => setAuthToken(null));

const userApiResponse = (id = 1) => ({
  id,
  username: `user${id}`,
  firstName: "Test",
  lastName: `User${id}`,
  email: `user${id}@example.com`,
  isAdmin: false,
});

// ── register ──────────────────────────────────────────────────────────────────

test("register sends POST and resolves", async () => {
  server.use(
    http.post(`${BASE}/users/`, () =>
      HttpResponse.json({ message: "Created" }, { status: 201 })
    )
  );
  await expect(
    register({
      firstName: "Ana",
      lastName: "Lima",
      email: "ana@test.com",
      username: "ana",
      password: "pass123",
    })
  ).resolves.toBeUndefined();
});

// ── getProfile ────────────────────────────────────────────────────────────────

test("getProfile returns mapped user profile", async () => {
  server.use(
    http.get(`${BASE}/users/user`, () => HttpResponse.json(userApiResponse(5)))
  );
  const profile = await getProfile();
  expect(profile.id).toBe(5);
  expect(profile.firstName).toBe("Test");
  expect(profile.email).toBe("user5@example.com");
  expect(profile.username).toBe("user5");
});

// ── updateProfile ─────────────────────────────────────────────────────────────

test("updateProfile sends PUT with correct data", async () => {
  server.use(
    http.put(`${BASE}/users/3`, async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json({ ...userApiResponse(3), ...(body as object) });
    })
  );
  await expect(
    updateProfile({ id: 3, firstName: "Updated", lastName: "Name", email: "u@t.com", username: "up" })
  ).resolves.toBeUndefined();
});

test("updateProfile throws when id is missing", async () => {
  await expect(
    updateProfile({ firstName: "No", lastName: "Id" })
  ).rejects.toThrow("User ID is required");
});

// ── updatePassword ────────────────────────────────────────────────────────────

test("updatePassword sends new password", async () => {
  server.use(
    http.post(`${BASE}/users/reset-password`, () => HttpResponse.json({ ok: true }))
  );
  await expect(updatePassword({ password: "newpass" })).resolves.toBeUndefined();
});

test("updatePassword skips call when password is empty", async () => {
  // no MSW handler needed — should short-circuit
  await expect(updatePassword({})).resolves.toBeUndefined();
  await expect(updatePassword({ password: "" })).resolves.toBeUndefined();
});

// ── getNotes ──────────────────────────────────────────────────────────────────

test("getNotes returns notes string", async () => {
  server.use(
    http.get(`${BASE}/users/me/notes`, () =>
      HttpResponse.json({ notes: "My notes content" })
    )
  );
  const notes = await getNotes();
  expect(notes).toBe("My notes content");
});

test("getNotes returns empty string when notes is null/missing", async () => {
  server.use(
    http.get(`${BASE}/users/me/notes`, () => HttpResponse.json({ notes: null }))
  );
  const notes = await getNotes();
  expect(notes).toBe("");
});

// ── saveNotes ─────────────────────────────────────────────────────────────────

test("saveNotes sends PUT and resolves", async () => {
  server.use(
    http.put(`${BASE}/users/me/notes`, () => HttpResponse.json({ ok: true }))
  );
  await expect(saveNotes("updated notes")).resolves.toBeUndefined();
});
