/**
 * Tests for common/services/commentService.ts
 */
import { http, HttpResponse } from "msw";
import { setupMswForTest } from "../../mocks/msw/setupMswForTest";
import { server } from "../../mocks/msw/server";
import { commentService } from "@/common/services/commentService";
import { setAuthToken } from "@/common/utils/tokenStore";

setupMswForTest();

const BASE = "http://localhost:8000/api";

beforeEach(() => setAuthToken("token"));
afterEach(() => setAuthToken(null));

const commentApiResponse = (id = 1) => ({
  id,
  description: `Comment ${id}`,
  createdAt: "2026-01-01T00:00:00",
  updatedAt: "2026-01-01T00:00:00",
  user: { id: 2, firstName: "Ana", lastName: "Lima", email: "ana@test.com" },
});

// ── getByCardId ───────────────────────────────────────────────────────────────

test("getByCardId returns mapped comments", async () => {
  server.use(
    http.get(`${BASE}/cards/10`, () =>
      HttpResponse.json({
        comments: [commentApiResponse(1), commentApiResponse(2)],
      })
    )
  );
  const comments = await commentService.getByCardId(10);
  expect(comments).toHaveLength(2);
  expect(comments[0].id).toBe(1);
  expect(comments[0].description).toBe("Comment 1");
  expect(comments[0].user.firstName).toBe("Ana");
});

test("getByCardId returns empty array when no comments", async () => {
  server.use(
    http.get(`${BASE}/cards/5`, () =>
      HttpResponse.json({ id: 5, title: "Task" })
    )
  );
  const comments = await commentService.getByCardId(5);
  expect(comments).toEqual([]);
});

// ── create ────────────────────────────────────────────────────────────────────

test("create posts comment and returns mapped comment", async () => {
  server.use(
    http.post(`${BASE}/comments/card/3`, async ({ request }) => {
      const body = (await request.json()) as { description: string };
      return HttpResponse.json(
        { ...commentApiResponse(99), description: body.description },
        { status: 201 }
      );
    })
  );
  const comment = await commentService.create(3, "Great work!");
  expect(comment.id).toBe(99);
  expect(comment.description).toBe("Great work!");
});

// ── update ────────────────────────────────────────────────────────────────────

test("update sends PUT and returns updated comment", async () => {
  server.use(
    http.put(`${BASE}/comments/7`, async ({ request }) => {
      const body = (await request.json()) as { description: string };
      return HttpResponse.json({
        ...commentApiResponse(7),
        description: body.description,
      });
    })
  );
  const comment = await commentService.update(7, "Edited comment");
  expect(comment.id).toBe(7);
  expect(comment.description).toBe("Edited comment");
});

// ── delete ────────────────────────────────────────────────────────────────────

test("delete sends DELETE and resolves", async () => {
  server.use(
    http.delete(`${BASE}/comments/4`, () =>
      new HttpResponse(null, { status: 204 })
    )
  );
  await expect(commentService.delete(4)).resolves.toBeUndefined();
});

// ── comment mapping ───────────────────────────────────────────────────────────

test("comment without user gets default user", async () => {
  server.use(
    http.get(`${BASE}/cards/20`, () =>
      HttpResponse.json({
        comments: [{ id: 5, description: "No user comment" }],
      })
    )
  );
  const comments = await commentService.getByCardId(20);
  expect(comments[0].user).toEqual({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
  });
});

test("comment without dates uses current time", async () => {
  server.use(
    http.get(`${BASE}/cards/21`, () =>
      HttpResponse.json({
        comments: [{ id: 6, description: "No dates" }],
      })
    )
  );
  const comments = await commentService.getByCardId(21);
  expect(comments[0].createdAt).toBeDefined();
  expect(comments[0].updatedAt).toBeDefined();
});
