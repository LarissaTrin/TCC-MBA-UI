/**
 * Tests for common/services/authService.ts
 * MSW intercepts direct fetch calls (no apiClient wrapper here).
 */
import { http, HttpResponse } from "msw";
import { setupMswForTest } from "../../mocks/msw/setupMswForTest";
import { server } from "../../mocks/msw/server";
import {
  login,
  forgotPassword,
  resetPassword,
  validateToken,
} from "@/common/services/authService";

setupMswForTest();

const BASE = "http://localhost:8000/api";

// ── login ────────────────────────────────────────────────────────────────────

test("login returns AuthUser on success", async () => {
  server.use(
    http.post(`${BASE}/users/login`, () =>
      HttpResponse.json({
        accessToken: "jwt-abc",
        expiresAt: "2099-01-01",
        userId: 7,
        firstName: "Ana",
        lastName: "Lima",
      })
    )
  );
  const user = await login("ana@example.com", "secret");
  expect(user).not.toBeNull();
  expect(user!.id).toBe("7");
  expect(user!.name).toBe("Ana Lima");
  expect(user!.accessToken).toBe("jwt-abc");
  expect(user!.email).toBe("ana@example.com");
});

test("login returns null on non-ok response", async () => {
  server.use(
    http.post(`${BASE}/users/login`, () =>
      HttpResponse.json({ detail: "Unauthorized" }, { status: 401 })
    )
  );
  const user = await login("bad@example.com", "wrong");
  expect(user).toBeNull();
});

test("login returns null on network error", async () => {
  server.use(
    http.post(`${BASE}/users/login`, () => {
      throw new Error("Network failure");
    })
  );
  const user = await login("user@example.com", "pass");
  expect(user).toBeNull();
});

// ── forgotPassword ───────────────────────────────────────────────────────────

test("forgotPassword resolves on success", async () => {
  server.use(
    http.post(`${BASE}/users/forgot-password`, () =>
      HttpResponse.json({ message: "Email sent" })
    )
  );
  await expect(forgotPassword("user@example.com")).resolves.toBeUndefined();
});

test("forgotPassword throws on error response", async () => {
  server.use(
    http.post(`${BASE}/users/forgot-password`, () =>
      HttpResponse.json({ detail: "Not found" }, { status: 404 })
    )
  );
  await expect(forgotPassword("unknown@example.com")).rejects.toThrow();
});

// ── resetPassword ────────────────────────────────────────────────────────────

test("resetPassword resolves on success", async () => {
  server.use(
    http.post(`${BASE}/users/reset-password`, () =>
      HttpResponse.json({ message: "OK" })
    )
  );
  await expect(resetPassword("valid-token", "newpass123")).resolves.toBeUndefined();
});

test("resetPassword throws with detail message on failure", async () => {
  server.use(
    http.post(`${BASE}/users/reset-password`, () =>
      HttpResponse.json({ detail: "Token expired" }, { status: 400 })
    )
  );
  await expect(resetPassword("expired-token", "pass")).rejects.toThrow(
    "Token expired"
  );
});

test("resetPassword throws fallback message when no detail", async () => {
  server.use(
    http.post(`${BASE}/users/reset-password`, () =>
      new HttpResponse("bad request", { status: 400 })
    )
  );
  await expect(resetPassword("bad-token", "pass")).rejects.toThrow("ERROR");
});

// ── validateToken ────────────────────────────────────────────────────────────

test("validateToken returns true on 200", async () => {
  server.use(
    http.get(`${BASE}/users/user`, () =>
      HttpResponse.json({ id: 1, username: "alice" })
    )
  );
  const valid = await validateToken("good-token");
  expect(valid).toBe(true);
});

test("validateToken returns false on 401", async () => {
  server.use(
    http.get(`${BASE}/users/user`, () =>
      HttpResponse.json({ detail: "Unauthorized" }, { status: 401 })
    )
  );
  const valid = await validateToken("expired-token");
  expect(valid).toBe(false);
});

test("validateToken returns false on network error", async () => {
  server.use(
    http.get(`${BASE}/users/user`, () => {
      throw new Error("Network error");
    })
  );
  const valid = await validateToken("any-token");
  expect(valid).toBe(false);
});
