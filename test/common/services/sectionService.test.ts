/**
 * Tests for common/services/sectionService.ts
 */
import { http, HttpResponse } from "msw";
import { setupMswForTest } from "../../mocks/msw/setupMswForTest";
import { server } from "../../mocks/msw/server";
import { sectionService } from "@/common/services/sectionService";
import { setAuthToken } from "@/common/utils/tokenStore";
import { buildSection } from "../../mocks/factories";

setupMswForTest();

const BASE = "http://localhost:8000/api";

beforeEach(() => setAuthToken("token"));
afterEach(() => setAuthToken(null));

const listApiResponse = (id = 1, order = 0, isFinal = false) => ({
  id,
  name: `List ${id}`,
  order,
  isFinal,
  cards: [],
});

// ── getSectionsOnly ───────────────────────────────────────────────────────────

test("getSectionsOnly returns mapped sections", async () => {
  server.use(
    http.get(`${BASE}/projects/1/lists/`, () =>
      HttpResponse.json([
        listApiResponse(1, 0),
        listApiResponse(2, 1, true),
      ])
    )
  );
  const sections = await sectionService.getSectionsOnly(1);
  expect(sections).toHaveLength(2);
  expect(sections[0].id).toBe("1");
  expect(sections[0].name).toBe("List 1");
  expect(sections[1].isFinal).toBe(true);
});

test("getSectionsOnly returns empty array for projectId=0", async () => {
  const sections = await sectionService.getSectionsOnly(0);
  expect(sections).toEqual([]);
});

// ── getSections ───────────────────────────────────────────────────────────────

test("getSections returns sections for valid projectId", async () => {
  server.use(
    http.get(`${BASE}/projects/2/lists/`, () =>
      HttpResponse.json([listApiResponse(3, 0)])
    )
  );
  const sections = await sectionService.getSections(2);
  expect(sections).toHaveLength(1);
  expect(sections[0].id).toBe("3");
});

test("getSections returns empty array when projectId is undefined", async () => {
  const sections = await sectionService.getSections(undefined);
  expect(sections).toEqual([]);
});

// ── getCardsByList ────────────────────────────────────────────────────────────

test("getCardsByList returns paginated cards and tasks", async () => {
  server.use(
    http.get(`${BASE}/projects/1/lists/10/cards`, () =>
      HttpResponse.json({
        cards: [
          {
            id: 1,
            title: "Task A",
            cardNumber: 1,
            listId: 10,
            sortOrder: 1,
            blocked: false,
          },
        ],
        total: 1,
        page: 1,
        has_more: false,
      })
    )
  );
  const section = buildSection({ id: "10", name: "To Do", order: 0 });
  const result = await sectionService.getCardsByList(1, section, 1, 20);

  expect(result.total).toBe(1);
  expect(result.page).toBe(1);
  expect(result.hasMore).toBe(false);
  expect(result.cards).toHaveLength(1);
  expect(result.cards[0].name).toBe("Task A");
  expect(result.tasks).toBeDefined();
});

// ── getListsWithCards ─────────────────────────────────────────────────────────

test("getListsWithCards returns sections and all cards", async () => {
  server.use(
    http.get(`${BASE}/projects/5/lists/`, () =>
      HttpResponse.json([
        listApiResponse(1, 0),
        listApiResponse(2, 1, true),
      ])
    ),
    http.get(`${BASE}/projects/5/lists/1/cards`, () =>
      HttpResponse.json({
        cards: [{ id: 10, title: "Card 10", cardNumber: 1, listId: 1, blocked: false }],
        total: 1,
        page: 1,
        has_more: false,
      })
    ),
    http.get(`${BASE}/projects/5/lists/2/cards`, () =>
      HttpResponse.json({ cards: [], total: 0, page: 1, has_more: false })
    )
  );
  const result = await sectionService.getListsWithCards(5);
  expect(result.sections).toHaveLength(2);
  expect(result.cards).toHaveLength(1);
  expect(result.cards[0].name).toBe("Card 10");
});

// ── create ────────────────────────────────────────────────────────────────────

test("create posts list and returns mapped section", async () => {
  server.use(
    http.post(`${BASE}/projects/1/lists/`, async ({ request }) => {
      const body = (await request.json()) as { name: string; order?: number };
      return HttpResponse.json(
        { id: 99, name: body.name, order: body.order ?? 0, isFinal: false },
        { status: 201 }
      );
    })
  );
  const section = await sectionService.create(1, { name: "New List", order: 3 });
  expect(section.id).toBe("99");
  expect(section.name).toBe("New List");
});

// ── update ────────────────────────────────────────────────────────────────────

test("update sends PUT and returns mapped section", async () => {
  server.use(
    http.put(`${BASE}/projects/1/lists/5`, () =>
      HttpResponse.json({ id: 5, name: "Updated", order: 2, isFinal: false })
    )
  );
  const section = await sectionService.update(1, 5, { name: "Updated" });
  expect(section.id).toBe("5");
  expect(section.name).toBe("Updated");
});

// ── deleteSection ─────────────────────────────────────────────────────────────

test("deleteSection sends DELETE and resolves", async () => {
  server.use(
    http.delete(`${BASE}/projects/1/lists/3`, () =>
      new HttpResponse(null, { status: 204 })
    )
  );
  await expect(sectionService.deleteSection(1, 3)).resolves.toBeUndefined();
});

test("deleteSection appends target_list_id query param", async () => {
  server.use(
    http.delete(`${BASE}/projects/1/lists/3`, ({ request }) => {
      const url = new URL(request.url);
      const target = url.searchParams.get("target_list_id");
      return HttpResponse.json({ target });
    })
  );
  await expect(sectionService.deleteSection(1, 3, 7)).resolves.toBeUndefined();
});
