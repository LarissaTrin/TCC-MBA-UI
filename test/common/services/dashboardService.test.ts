/**
 * Tests for common/services/dashboardService.ts
 */
import { http, HttpResponse } from "msw";
import { setupMswForTest } from "../../mocks/msw/setupMswForTest";
import { server } from "../../mocks/msw/server";
import { dashboardService } from "@/common/services/dashboardService";
import { setAuthToken } from "@/common/utils/tokenStore";

setupMswForTest();

const BASE = "http://localhost:8000/api";

beforeEach(() => setAuthToken("token"));
afterEach(() => setAuthToken(null));

const mockCard = { id: 1, title: "Task A", listId: 10, listName: "To Do" };

test("getMyCards returns my-cards response", async () => {
  server.use(
    http.get(`${BASE}/dashboard/my-cards`, () =>
      HttpResponse.json({
        assigned: [mockCard],
        dueToday: [],
        overdue: [],
        pendingApprovals: [],
      })
    )
  );
  const result = await dashboardService.getMyCards();
  expect(result.assigned).toHaveLength(1);
  expect(result.assigned[0].id).toBe(1);
});

test("getMyDay returns dueToday and overdue", async () => {
  server.use(
    http.get(`${BASE}/dashboard/my-day`, () =>
      HttpResponse.json({
        dueToday: [mockCard],
        overdue: [],
      })
    )
  );
  const result = await dashboardService.getMyDay();
  expect(result.dueToday).toHaveLength(1);
  expect(result.overdue).toHaveLength(0);
});

test("getPendingApprovals returns pending cards", async () => {
  server.use(
    http.get(`${BASE}/dashboard/pending-approvals`, () =>
      HttpResponse.json({ pending: [mockCard] })
    )
  );
  const result = await dashboardService.getPendingApprovals();
  expect(result.pending).toHaveLength(1);
});

test("getProjectStats returns stats for project", async () => {
  const stats = {
    totalCards: 20,
    completedCards: 10,
    byList: [],
    byPriority: [],
    byTag: [],
  };
  server.use(
    http.get(`${BASE}/dashboard/project/3/stats`, () => HttpResponse.json(stats))
  );
  const result = await dashboardService.getProjectStats(3);
  expect(result.totalCards).toBe(20);
});

test("getBurndown returns burndown points with correct query params", async () => {
  server.use(
    http.get(`${BASE}/dashboard/project/5/burndown`, ({ request }) => {
      const url = new URL(request.url);
      const start = url.searchParams.get("start");
      const end = url.searchParams.get("end");
      return HttpResponse.json({
        points: [
          { date: start, remaining: 10, ideal: 10 },
          { date: end, remaining: 0, ideal: 0 },
        ],
      });
    })
  );
  const result = await dashboardService.getBurndown(5, "2026-01-01", "2026-01-31");
  expect(result.points).toHaveLength(2);
  expect(result.points[0].date).toBe("2026-01-01");
});
