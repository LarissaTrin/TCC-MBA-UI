/**
 * Tests for common/provider/ThemeProvider.tsx
 */
import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ThemeProvider, useThemeMode } from "@/common/provider/ThemeProvider";

beforeEach(() => localStorage.clear());

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

// ── default context ───────────────────────────────────────────────────────────

test("useThemeMode default context returns light mode", () => {
  const { result } = renderHook(() => useThemeMode());
  expect(result.current.mode).toBe("light");
});

// ── initial state ─────────────────────────────────────────────────────────────

test("loads light mode from localStorage", async () => {
  localStorage.setItem("themeMode", "light");
  const { result } = renderHook(() => useThemeMode(), { wrapper });
  await waitFor(() => expect(result.current.mode).toBe("light"));
});

test("loads dark mode from localStorage", async () => {
  localStorage.setItem("themeMode", "dark");
  const { result } = renderHook(() => useThemeMode(), { wrapper });
  await waitFor(() => expect(result.current.mode).toBe("dark"));
});

// ── toggleMode ────────────────────────────────────────────────────────────────

test("toggleMode switches from light to dark", async () => {
  localStorage.setItem("themeMode", "light");
  const { result } = renderHook(() => useThemeMode(), { wrapper });
  await waitFor(() => expect(result.current.mode).toBe("light"));

  act(() => result.current.toggleMode());
  expect(result.current.mode).toBe("dark");
  expect(localStorage.getItem("themeMode")).toBe("dark");
});

test("toggleMode switches from dark to light", async () => {
  localStorage.setItem("themeMode", "dark");
  const { result } = renderHook(() => useThemeMode(), { wrapper });
  await waitFor(() => expect(result.current.mode).toBe("dark"));

  act(() => result.current.toggleMode());
  expect(result.current.mode).toBe("light");
});

// ── setPrimaryColor ───────────────────────────────────────────────────────────

test("setPrimaryColor updates color and persists to localStorage", async () => {
  localStorage.setItem("themeMode", "light");
  const { result } = renderHook(() => useThemeMode(), { wrapper });
  await waitFor(() => expect(result.current.mode).toBe("light"));

  act(() => result.current.setPrimaryColor("#ff5722"));
  expect(result.current.primaryColor).toBe("#ff5722");
  expect(localStorage.getItem("themePrimaryColor")).toBe("#ff5722");
});

test("loads primaryColor from localStorage", async () => {
  localStorage.setItem("themeMode", "light");
  localStorage.setItem("themePrimaryColor", "#e91e63");
  const { result } = renderHook(() => useThemeMode(), { wrapper });
  await waitFor(() => expect(result.current.primaryColor).toBe("#e91e63"));
});
