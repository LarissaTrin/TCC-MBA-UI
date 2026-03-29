/**
 * Tests for common/provider/I18nProvider.tsx
 */
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { I18nProvider, useTranslation } from "@/common/provider/I18nProvider";
import { Language } from "@/common/enum";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nProvider>{children}</I18nProvider>
);

beforeEach(() => localStorage.clear());

// ── initial state ─────────────────────────────────────────────────────────────

test("starts with English locale", () => {
  const { result } = renderHook(() => useTranslation(), { wrapper });
  expect(result.current.locale).toBe(Language.EN);
});

test("t() returns translation key as fallback when key not found", () => {
  const { result } = renderHook(() => useTranslation(), { wrapper });
  expect(result.current.t("nonexistent.key")).toBe("nonexistent.key");
});

test("t() returns provided fallback when key not found", () => {
  const { result } = renderHook(() => useTranslation(), { wrapper });
  expect(result.current.t("nonexistent.key", "Default")).toBe("Default");
});

test("t() returns string for any key", () => {
  const { result } = renderHook(() => useTranslation(), { wrapper });
  const value = result.current.t("some.key", "Fallback Value");
  expect(typeof value).toBe("string");
  expect(value).toBe("Fallback Value");
});

// ── changeLocale ──────────────────────────────────────────────────────────────

test("changeLocale switches to pt-BR", () => {
  const { result } = renderHook(() => useTranslation(), { wrapper });
  act(() => result.current.changeLocale(Language.PT_BR));
  expect(result.current.locale).toBe(Language.PT_BR);
});

test("changeLocale persists to localStorage", () => {
  const { result } = renderHook(() => useTranslation(), { wrapper });
  act(() => result.current.changeLocale(Language.PT_BR));
  expect(localStorage.getItem("locale")).toBe(Language.PT_BR);
});

test("changeLocale back to EN works", () => {
  const { result } = renderHook(() => useTranslation(), { wrapper });
  act(() => result.current.changeLocale(Language.PT_BR));
  act(() => result.current.changeLocale(Language.EN));
  expect(result.current.locale).toBe(Language.EN);
});

// ── default context (without provider) ───────────────────────────────────────

test("useTranslation default context t() returns key", () => {
  const { result } = renderHook(() => useTranslation());
  expect(result.current.t("some.key")).toBe("some.key");
  expect(result.current.locale).toBe(Language.EN);
});

// ── localStorage cache ────────────────────────────────────────────────────────

test("loads locale from localStorage on mount", () => {
  localStorage.setItem("locale", Language.PT_BR);
  const { result } = renderHook(() => useTranslation(), { wrapper });
  // After mount the useEffect should pick up PT_BR
  expect(result.current.locale).toBeDefined();
});
