/**
 * Tests for common/hooks/useProjectTagSearch.ts
 */
import { renderHook, act } from "@testing-library/react";
import { useProjectTagSearch } from "@/common/hooks/useProjectTagSearch";

jest.mock("@/common/services", () => ({
  tagService: {
    getProjectTags: jest.fn(),
  },
}));

import { tagService } from "@/common/services";

beforeEach(() => jest.clearAllMocks());

const mockTags = [
  { id: 1, name: "backend" },
  { id: 2, name: "frontend" },
];

// ── initial state ─────────────────────────────────────────────────────────────

test("starts with empty options and not loading", () => {
  const { result } = renderHook(() => useProjectTagSearch(1));
  expect(result.current.options).toEqual([]);
  expect(result.current.loading).toBe(false);
});

// ── load ──────────────────────────────────────────────────────────────────────

test("load fetches all project tags", async () => {
  (tagService.getProjectTags as jest.Mock).mockResolvedValue(mockTags);

  const { result } = renderHook(() => useProjectTagSearch(5));
  await act(async () => {
    await result.current.load();
  });

  expect(result.current.options).toEqual([
    { label: "backend", value: "1" },
    { label: "frontend", value: "2" },
  ]);
  expect(result.current.loading).toBe(false);
});

test("load does nothing without projectId", async () => {
  const { result } = renderHook(() => useProjectTagSearch(undefined));
  await act(async () => await result.current.load());
  expect(tagService.getProjectTags).not.toHaveBeenCalled();
});

test("load does not re-fetch if already loaded", async () => {
  (tagService.getProjectTags as jest.Mock).mockResolvedValue(mockTags);

  const { result } = renderHook(() => useProjectTagSearch(5));
  await act(async () => await result.current.load());
  await act(async () => await result.current.load());

  expect(tagService.getProjectTags).toHaveBeenCalledTimes(1);
});

test("load with force=true re-fetches even if already loaded", async () => {
  (tagService.getProjectTags as jest.Mock).mockResolvedValue(mockTags);

  const { result } = renderHook(() => useProjectTagSearch(5));
  await act(async () => await result.current.load());
  await act(async () => await result.current.load(true));

  expect(tagService.getProjectTags).toHaveBeenCalledTimes(2);
});

test("load error sets options to empty array", async () => {
  (tagService.getProjectTags as jest.Mock).mockRejectedValue(
    new Error("API Error")
  );

  const { result } = renderHook(() => useProjectTagSearch(5));
  await act(async () => await result.current.load());

  expect(result.current.options).toEqual([]);
});

// ── search ────────────────────────────────────────────────────────────────────

test("search with empty query reloads all tags", async () => {
  (tagService.getProjectTags as jest.Mock).mockResolvedValue(mockTags);
  jest.useFakeTimers();

  const { result } = renderHook(() => useProjectTagSearch(5));
  act(() => result.current.search(""));

  await act(async () => {
    await Promise.resolve();
  });

  expect(tagService.getProjectTags).toHaveBeenCalled();
  jest.useRealTimers();
});

test("search without projectId does nothing", () => {
  const { result } = renderHook(() => useProjectTagSearch(undefined));
  act(() => result.current.search("test"));
  expect(tagService.getProjectTags).not.toHaveBeenCalled();
});

test("search with query fetches filtered tags after debounce", async () => {
  jest.useFakeTimers();
  (tagService.getProjectTags as jest.Mock).mockResolvedValue([
    { id: 1, name: "backend" },
  ]);

  const { result } = renderHook(() => useProjectTagSearch(5));
  act(() => result.current.search("back"));

  await act(async () => {
    jest.advanceTimersByTime(300);
    await Promise.resolve();
  });

  expect(result.current.options).toEqual([{ label: "backend", value: "1" }]);
  jest.useRealTimers();
});

test("search error sets options to empty array", async () => {
  jest.useFakeTimers();
  (tagService.getProjectTags as jest.Mock).mockRejectedValue(new Error("fail"));

  const { result } = renderHook(() => useProjectTagSearch(5));
  act(() => result.current.search("bad"));

  await act(async () => {
    jest.advanceTimersByTime(300);
    await Promise.resolve();
  });

  expect(result.current.options).toEqual([]);
  jest.useRealTimers();
});
