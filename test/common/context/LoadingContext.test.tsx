/**
 * Tests for common/context/LoadingContext.tsx
 */
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { LoadingProvider, useLoading } from "@/common/context/LoadingContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LoadingProvider>{children}</LoadingProvider>
);

test("isLoading starts as false", () => {
  const { result } = renderHook(() => useLoading(), { wrapper });
  expect(result.current.isLoading).toBe(false);
});

test("withLoading sets isLoading true while running, false after", async () => {
  const { result } = renderHook(() => useLoading(), { wrapper });

  let resolve!: () => void;
  const promise = new Promise<void>((res) => { resolve = res; });

  act(() => {
    result.current.withLoading(() => promise);
  });

  expect(result.current.isLoading).toBe(true);

  await act(async () => {
    resolve();
    await promise;
  });

  expect(result.current.isLoading).toBe(false);
});

test("withLoading returns the value from fn", async () => {
  const { result } = renderHook(() => useLoading(), { wrapper });
  let value: number | undefined;

  await act(async () => {
    value = await result.current.withLoading(() => Promise.resolve(42));
  });

  expect(value).toBe(42);
});

test("withLoading: isLoading stays true while multiple calls are active", async () => {
  const { result } = renderHook(() => useLoading(), { wrapper });

  let resolve1!: () => void;
  let resolve2!: () => void;
  const p1 = new Promise<void>((r) => { resolve1 = r; });
  const p2 = new Promise<void>((r) => { resolve2 = r; });

  act(() => {
    result.current.withLoading(() => p1);
    result.current.withLoading(() => p2);
  });

  expect(result.current.isLoading).toBe(true);

  await act(async () => {
    resolve1();
    await p1;
  });

  // still loading because p2 is pending
  expect(result.current.isLoading).toBe(true);

  await act(async () => {
    resolve2();
    await p2;
  });

  expect(result.current.isLoading).toBe(false);
});

test("useLoading default context returns isLoading=false", () => {
  // Without wrapper, the default context value is used
  const { result } = renderHook(() => useLoading());
  expect(result.current.isLoading).toBe(false);
});

test("useLoading default withLoading just calls fn", async () => {
  const { result } = renderHook(() => useLoading());
  const value = await result.current.withLoading(() => Promise.resolve("hello"));
  expect(value).toBe("hello");
});
