/**
 * Tests for common/services/cardService.ts
 */
import { http, HttpResponse } from "msw";
import { setupMswForTest } from "../../mocks/msw/setupMswForTest";
import { server } from "../../mocks/msw/server";
import { cardService } from "@/common/services/cardService";
import { setAuthToken } from "@/common/utils/tokenStore";

setupMswForTest();

const BASE = "http://localhost:8000/api";

beforeEach(() => setAuthToken("token"));
afterEach(() => setAuthToken(null));

/** Minimal CardApiResponse shape */
const cardApiResponse = (id = 1) => ({
  id,
  title: `Card ${id}`,
  cardNumber: id,
  listId: 10,
  sortOrder: id,
  blocked: false,
  priority: null,
  storyPoints: null,
  date: null,
  startDate: null,
  endDate: null,
  description: null,
  categoryId: null,
  category: null,
  user: null,
  tagCards: [],
  tasksCard: [],
  approvers: [],
  comments: [],
});

// ── getById ───────────────────────────────────────────────────────────────────

test("getById returns mapped card", async () => {
  server.use(
    http.get(`${BASE}/cards/1`, () => HttpResponse.json(cardApiResponse(1)))
  );
  const card = await cardService.getById(1);
  expect(card).toBeDefined();
  expect(card!.id).toBe(1);
  expect(card!.name).toBe("Card 1");
  expect(card!.sectionId).toBe("10");
});

test("getById returns undefined on error", async () => {
  server.use(
    http.get(`${BASE}/cards/99`, () =>
      HttpResponse.json({ detail: "Not found" }, { status: 404 })
    )
  );
  const card = await cardService.getById(99);
  expect(card).toBeUndefined();
});

// ── create ────────────────────────────────────────────────────────────────────

test("create posts to listId and returns mapped card", async () => {
  server.use(
    http.post(`${BASE}/cards/10`, () => HttpResponse.json(42, { status: 201 })),
    http.get(`${BASE}/cards/42`, () => HttpResponse.json(cardApiResponse(42)))
  );
  const card = await cardService.create("New Task", 10);
  expect(card.id).toBe(42);
  expect(card.name).toBe("Card 42");
});

// ── update ────────────────────────────────────────────────────────────────────

test("update sends PUT and returns mapped card", async () => {
  server.use(
    http.put(`${BASE}/cards/5`, () => HttpResponse.json(cardApiResponse(5)))
  );
  const card = await cardService.update(5, { title: "Updated" });
  expect(card.id).toBe(5);
});

// ── reorder ───────────────────────────────────────────────────────────────────

test("reorder sends PUT to /cards/reorder", async () => {
  server.use(
    http.put(`${BASE}/cards/reorder`, () => HttpResponse.json({ ok: true }))
  );
  await expect(
    cardService.reorder([{ cardId: 1, sortOrder: 2 }])
  ).resolves.toBeUndefined();
});

// ── delete ────────────────────────────────────────────────────────────────────

test("delete sends DELETE and resolves", async () => {
  server.use(
    http.delete(`${BASE}/cards/3`, () => new HttpResponse(null, { status: 204 }))
  );
  await expect(cardService.delete(3)).resolves.toBeUndefined();
});

// ── getHistory ────────────────────────────────────────────────────────────────

test("getHistory returns history entries", async () => {
  server.use(
    http.get(`${BASE}/cards/1/history`, () =>
      HttpResponse.json([
        { id: 1, action: "created", createdAt: "2026-01-01" },
        { id: 2, action: "updated", createdAt: "2026-01-02" },
      ])
    )
  );
  const history = await cardService.getHistory(1);
  expect(history).toHaveLength(2);
});

// ── searchCards ───────────────────────────────────────────────────────────────

test("searchCards returns results without projectId", async () => {
  server.use(
    http.get(`${BASE}/cards/search`, () =>
      HttpResponse.json([
        { id: 1, title: "Bug fix", cardNumber: 3, listId: 1 },
      ])
    )
  );
  const results = await cardService.searchCards("bug");
  expect(results).toHaveLength(1);
  expect(results[0].title).toBe("Bug fix");
});

test("searchCards includes project_id param", async () => {
  server.use(
    http.get(`${BASE}/cards/search`, ({ request }) => {
      const url = new URL(request.url);
      const projectId = url.searchParams.get("project_id");
      return HttpResponse.json(
        projectId === "5" ? [{ id: 2, title: "Deploy", cardNumber: 2, listId: 2 }] : []
      );
    })
  );
  const results = await cardService.searchCards("deploy", 5);
  expect(results).toHaveLength(1);
});

// ── getDependencies ───────────────────────────────────────────────────────────

test("getDependencies returns response", async () => {
  server.use(
    http.get(`${BASE}/cards/1/dependencies`, () =>
      HttpResponse.json({ blockedBy: [], blocking: [] })
    )
  );
  const deps = await cardService.getDependencies(1);
  expect(deps).toEqual({ blockedBy: [], blocking: [] });
});

// ── addDependency ─────────────────────────────────────────────────────────────

test("addDependency sends POST and resolves", async () => {
  server.use(
    http.post(`${BASE}/cards/1/dependencies`, () =>
      HttpResponse.json({}, { status: 201 })
    )
  );
  await expect(cardService.addDependency(1, 2)).resolves.toBeUndefined();
});

// ── removeDependency ──────────────────────────────────────────────────────────

test("removeDependency sends DELETE and resolves", async () => {
  server.use(
    http.delete(`${BASE}/cards/1/dependencies/2`, () =>
      new HttpResponse(null, { status: 204 })
    )
  );
  await expect(cardService.removeDependency(1, 2)).resolves.toBeUndefined();
});

// ── card mapping edge cases ───────────────────────────────────────────────────

test("card with tags gets mapped tags array", async () => {
  const cardWithTags = {
    ...cardApiResponse(10),
    tagCards: [
      { tag: { id: 1, name: "backend" } },
      { tag: { id: 2, name: "urgent" } },
    ],
  };
  server.use(
    http.get(`${BASE}/cards/10`, () => HttpResponse.json(cardWithTags))
  );
  const card = await cardService.getById(10);
  expect(card!.tags).toHaveLength(2);
  expect(card!.tags![0].name).toBe("backend");
});

test("card with null tagCards gets no tags", async () => {
  const cardNoTags = { ...cardApiResponse(11), tagCards: null };
  server.use(
    http.get(`${BASE}/cards/11`, () => HttpResponse.json(cardNoTags))
  );
  const card = await cardService.getById(11);
  expect(card!.tags).toBeUndefined();
});

test("card with dates maps them correctly", async () => {
  const cardWithDates = {
    ...cardApiResponse(12),
    date: "2026-06-15T00:00:00",
    startDate: "2026-06-01T00:00:00",
    endDate: "2026-06-30T00:00:00",
  };
  server.use(
    http.get(`${BASE}/cards/12`, () => HttpResponse.json(cardWithDates))
  );
  const card = await cardService.getById(12);
  expect(card!.dueDate).toBe("2026-06-15");
  expect(card!.startDate).toBe("2026-06-01");
  expect(card!.endDate).toBe("2026-06-30");
});
