/**
 * Tests for common/hooks/useHomePage.ts
 */
import { renderHook, waitFor } from "@testing-library/react";
import { useHomePageData } from "@/common/hooks/useHomePage";

jest.mock("@/common/services", () => ({
  projectService: { getAll: jest.fn() },
  dashboardService: { getMyCards: jest.fn() },
}));

jest.mock("@/common/context/LoadingContext", () => ({
  useLoading: () => ({
    withLoading: <T,>(fn: () => Promise<T>) => fn(),
  }),
}));

import { projectService, dashboardService } from "@/common/services";

beforeEach(() => jest.clearAllMocks());

const mockMyCards = {
  assigned: [{ id: 1, title: "Task A", listId: 10, listName: "To Do" }],
  dueToday: [{ id: 2, title: "Task B", listId: 10, listName: "To Do" }],
  overdue: [{ id: 3, title: "Task C", listId: 20, listName: "Done" }],
  pendingApprovals: [{ id: 4, title: "Review", listId: 30, listName: "Review" }],
};

test("useHomePageData returns projects and dashboard cards", async () => {
  (projectService.getAll as jest.Mock).mockResolvedValue([
    { id: 1, projectName: "Project Alpha" },
  ]);
  (dashboardService.getMyCards as jest.Mock).mockResolvedValue(mockMyCards);

  const { result } = renderHook(() => useHomePageData());

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.projects).toHaveLength(1);
  expect(result.current.assignedCards).toHaveLength(1);
  expect(result.current.dueTodayCards).toHaveLength(1);
  expect(result.current.overdueCards).toHaveLength(1);
  expect(result.current.pendingApprovalCards).toHaveLength(1);
  expect(result.current.error).toBeNull();
});

test("useHomePageData builds sectionNameMap from assigned and pendingApproval cards", async () => {
  (projectService.getAll as jest.Mock).mockResolvedValue([]);
  (dashboardService.getMyCards as jest.Mock).mockResolvedValue(mockMyCards);

  const { result } = renderHook(() => useHomePageData());
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.sectionNameMap["10"]).toBe("To Do");
  expect(result.current.sectionNameMap["30"]).toBe("Review");
});

test("useHomePageData sets error on failure", async () => {
  (projectService.getAll as jest.Mock).mockRejectedValue(new Error("Fail"));
  (dashboardService.getMyCards as jest.Mock).mockRejectedValue(new Error("Fail"));

  const { result } = renderHook(() => useHomePageData());
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.error).toBe("Failed to fetch data.");
});
