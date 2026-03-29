/**
 * Tests for common/hooks/useDashboard.ts (useMyDay, usePendingApprovals)
 */
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useMyDay, usePendingApprovals } from "@/common/hooks/useDashboard";

jest.mock("@/common/services", () => ({
  dashboardService: {
    getMyDay: jest.fn(),
    getPendingApprovals: jest.fn(),
  },
}));

import { dashboardService } from "@/common/services";

// Provide a minimal LoadingContext wrapper that passes through fn()
jest.mock("@/common/context/LoadingContext", () => ({
  useLoading: () => ({
    withLoading: <T,>(fn: () => Promise<T>) => fn(),
  }),
}));

beforeEach(() => jest.clearAllMocks());

// ── useMyDay ──────────────────────────────────────────────────────────────────

test("useMyDay returns dueToday and overdue cards", async () => {
  (dashboardService.getMyDay as jest.Mock).mockResolvedValue({
    dueToday: [{ id: 1, title: "Task A" }],
    overdue: [{ id: 2, title: "Task B" }],
  });

  const { result } = renderHook(() => useMyDay());

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.dueToday).toHaveLength(1);
  expect(result.current.dueToday[0].title).toBe("Task A");
  expect(result.current.overdue).toHaveLength(1);
});

test("useMyDay stays empty on error", async () => {
  (dashboardService.getMyDay as jest.Mock).mockRejectedValue(
    new Error("Network error")
  );

  const { result } = renderHook(() => useMyDay());
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.dueToday).toEqual([]);
  expect(result.current.overdue).toEqual([]);
});

// ── usePendingApprovals ───────────────────────────────────────────────────────

test("usePendingApprovals returns pending cards", async () => {
  (dashboardService.getPendingApprovals as jest.Mock).mockResolvedValue({
    pending: [{ id: 3, title: "Review" }],
  });

  const { result } = renderHook(() => usePendingApprovals());
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.pending).toHaveLength(1);
  expect(result.current.pending[0].title).toBe("Review");
});

test("usePendingApprovals stays empty on error", async () => {
  (dashboardService.getPendingApprovals as jest.Mock).mockRejectedValue(
    new Error("Error")
  );

  const { result } = renderHook(() => usePendingApprovals());
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.pending).toEqual([]);
});
