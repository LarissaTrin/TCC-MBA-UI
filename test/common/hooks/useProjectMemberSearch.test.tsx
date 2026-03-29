/**
 * Tests for common/hooks/useProjectMemberSearch.ts
 */
import { renderHook, act } from "@testing-library/react";
import { useProjectMemberSearch } from "@/common/hooks/useProjectMemberSearch";

jest.mock("@/common/services", () => ({
  projectService: {
    searchMembers: jest.fn(),
  },
}));

import { projectService } from "@/common/services";

beforeEach(() => jest.clearAllMocks());

// ── initial state ─────────────────────────────────────────────────────────────

test("starts with empty options and not loading", () => {
  const { result } = renderHook(() => useProjectMemberSearch(1));
  expect(result.current.options).toEqual([]);
  expect(result.current.loading).toBe(false);
});

// ── search with empty/short query ─────────────────────────────────────────────

test("search with empty string clears options", () => {
  const { result } = renderHook(() => useProjectMemberSearch(1));
  act(() => result.current.search(""));
  expect(result.current.options).toEqual([]);
  expect(projectService.searchMembers).not.toHaveBeenCalled();
});

test("search with whitespace only clears options", () => {
  const { result } = renderHook(() => useProjectMemberSearch(1));
  act(() => result.current.search("   "));
  expect(result.current.options).toEqual([]);
});

// ── no projectId ─────────────────────────────────────────────────────────────

test("search without projectId does nothing", () => {
  const { result } = renderHook(() => useProjectMemberSearch(undefined));
  act(() => result.current.search("ana"));
  expect(projectService.searchMembers).not.toHaveBeenCalled();
});

// ── successful search ────────────────────────────────────────────────────────

test("search with valid query fetches members after debounce", async () => {
  jest.useFakeTimers();
  (projectService.searchMembers as jest.Mock).mockResolvedValue([
    { value: "1", label: "Ana Lima" },
  ]);

  const { result } = renderHook(() => useProjectMemberSearch(5));
  act(() => result.current.search("ana"));

  await act(async () => {
    jest.advanceTimersByTime(300);
    await Promise.resolve();
  });

  expect(result.current.options).toEqual([{ value: "1", label: "Ana Lima" }]);
  expect(result.current.loading).toBe(false);
  jest.useRealTimers();
});

// ── search error ──────────────────────────────────────────────────────────────

test("search failure sets options to empty array", async () => {
  jest.useFakeTimers();
  (projectService.searchMembers as jest.Mock).mockRejectedValue(
    new Error("Network error")
  );

  const { result } = renderHook(() => useProjectMemberSearch(5));
  act(() => result.current.search("fail"));

  await act(async () => {
    jest.advanceTimersByTime(300);
    await Promise.resolve();
  });

  expect(result.current.options).toEqual([]);
  jest.useRealTimers();
});

// ── seedOption ────────────────────────────────────────────────────────────────

test("seedOption adds new option to the front", () => {
  const { result } = renderHook(() => useProjectMemberSearch(1));
  act(() => result.current.seedOption({ value: "99", label: "New User" }));
  expect(result.current.options[0]).toEqual({ value: "99", label: "New User" });
});

test("seedOption does not duplicate existing option", () => {
  const { result } = renderHook(() => useProjectMemberSearch(1));
  act(() => result.current.seedOption({ value: "1", label: "User" }));
  act(() => result.current.seedOption({ value: "1", label: "User" }));
  expect(result.current.options).toHaveLength(1);
});
