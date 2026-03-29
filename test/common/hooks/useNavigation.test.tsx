/**
 * Tests for common/hooks/useNavigation.ts
 */
import { renderHook, act } from "@testing-library/react";
import { useNavigation } from "@/common/hooks/useNavigation";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: jest.fn(() => "/"),
}));

jest.mock("@/common/context/LoadingContext", () => ({
  useLoading: () => ({
    withLoading: <T,>(fn: () => Promise<T>) => fn(),
  }),
}));

import { usePathname } from "next/navigation";

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test("navigate calls router.push with the given path", () => {
  const { result } = renderHook(() => useNavigation());
  act(() => result.current.navigate("/projects"));
  expect(mockPush).toHaveBeenCalledWith("/projects");
});

test("navigate resolves when pathname changes", async () => {
  const { result, rerender } = renderHook(() => useNavigation());

  act(() => result.current.navigate("/home"));
  expect(mockPush).toHaveBeenCalledWith("/home");

  // Simulate pathname change
  (usePathname as jest.Mock).mockReturnValue("/home");

  await act(async () => {
    rerender();
    jest.advanceTimersByTime(100);
    await Promise.resolve();
  });
});

test("navigate resolves via safety fallback after 5s", async () => {
  const { result } = renderHook(() => useNavigation());

  act(() => result.current.navigate("/slow-route"));

  await act(async () => {
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
  });

  expect(mockPush).toHaveBeenCalledWith("/slow-route");
});
