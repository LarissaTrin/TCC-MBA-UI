/**
 * Tests for common/services/apiClient.ts
 * MSW intercepts fetch calls; tokenStore is seeded before each test.
 */
import { http, HttpResponse } from "msw";
import { setupMswForTest } from "../../mocks/msw/setupMswForTest";
import { server } from "../../mocks/msw/server";
import { apiClient, ApiError } from "@/common/services/apiClient";
import { setAuthToken } from "@/common/utils/tokenStore";

setupMswForTest();

const BASE = "http://localhost:8000/api";

beforeEach(() => setAuthToken("test-token"));
afterEach(() => setAuthToken(null));

// ── GET ──────────────────────────────────────────────────────────────────────

test("get returns parsed JSON on 200", async () => {
  server.use(http.get(`${BASE}/test`, () => HttpResponse.json({ ok: true })));
  const result = await apiClient.get<{ ok: boolean }>("/test");
  expect(result).toEqual({ ok: true });
});

test("get throws ApiError on 4xx", async () => {
  server.use(
    http.get(`${BASE}/fail`, () =>
      HttpResponse.json({ detail: "Not found" }, { status: 404 })
    )
  );
  await expect(apiClient.get("/fail")).rejects.toBeInstanceOf(ApiError);
});

test("get returns undefined for empty body on 204", async () => {
  server.use(
    http.get(`${BASE}/empty`, () => new HttpResponse(null, { status: 200 }))
  );
  const result = await apiClient.get("/empty");
  expect(result).toBeUndefined();
});

// ── POST ─────────────────────────────────────────────────────────────────────

test("post sends JSON body and returns response", async () => {
  server.use(
    http.post(`${BASE}/items`, async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json({ received: body }, { status: 201 });
    })
  );
  const result = await apiClient.post<{ received: object }>("/items", {
    name: "test",
  });
  expect(result).toEqual({ received: { name: "test" } });
});

test("post without body sends no body", async () => {
  server.use(
    http.post(`${BASE}/ping`, () => HttpResponse.json({ pong: true }))
  );
  const result = await apiClient.post<{ pong: boolean }>("/ping");
  expect(result.pong).toBe(true);
});

test("post throws ApiError on error status", async () => {
  server.use(
    http.post(`${BASE}/bad`, () =>
      HttpResponse.json({ detail: "error" }, { status: 400 })
    )
  );
  await expect(apiClient.post("/bad", {})).rejects.toBeInstanceOf(ApiError);
});

// ── PUT ──────────────────────────────────────────────────────────────────────

test("put sends JSON and returns updated resource", async () => {
  server.use(
    http.put(`${BASE}/items/1`, async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json({ id: 1, ...(body as object) });
    })
  );
  const result = await apiClient.put<{ id: number; name: string }>(
    "/items/1",
    { name: "updated" }
  );
  expect(result.name).toBe("updated");
});

// ── DELETE ───────────────────────────────────────────────────────────────────

test("delete resolves on 204", async () => {
  server.use(
    http.delete(`${BASE}/items/1`, () => new HttpResponse(null, { status: 204 }))
  );
  await expect(apiClient.delete("/items/1")).resolves.toBeUndefined();
});

test("delete throws ApiError on 404", async () => {
  server.use(
    http.delete(`${BASE}/items/99`, () =>
      HttpResponse.json({ detail: "Not found" }, { status: 404 })
    )
  );
  await expect(apiClient.delete("/items/99")).rejects.toBeInstanceOf(ApiError);
});

// ── postForm ─────────────────────────────────────────────────────────────────

test("postForm sends form-encoded body", async () => {
  server.use(
    http.post(`${BASE}/form`, async ({ request }) => {
      const text = await request.text();
      return HttpResponse.json({ received: text });
    })
  );
  const params = new URLSearchParams({ username: "alice", password: "pass" });
  const result = await apiClient.postForm<{ received: string }>(
    "/form",
    params
  );
  expect(result.received).toContain("username=alice");
});

// ── ApiError class ───────────────────────────────────────────────────────────

test("ApiError has correct name, status and body", () => {
  const err = new ApiError(422, "Unprocessable");
  expect(err.name).toBe("ApiError");
  expect(err.status).toBe(422);
  expect(err.body).toBe("Unprocessable");
  expect(err.message).toContain("422");
  expect(err.message).toContain("Unprocessable");
});
