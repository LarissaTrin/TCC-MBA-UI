"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createAppTheme, DEFAULT_PRIMARY } from "./theme";

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeModeContextType {
  mode: "light" | "dark";
  toggleMode: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeModeContext = createContext<ThemeModeContextType>({
  mode: "light",
  toggleMode: () => {},
  primaryColor: DEFAULT_PRIMARY,
  setPrimaryColor: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [primaryColor, setPrimaryColorState] = useState<string>(DEFAULT_PRIMARY);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as "light" | "dark" | null;
    const savedColor = localStorage.getItem("themePrimaryColor");

    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(prefersDark ? "dark" : "light");
    }

    if (savedColor) setPrimaryColorState(savedColor);

    setMounted(true);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", next);
      return next;
    });
  }, []);

  const setPrimaryColor = useCallback((color: string) => {
    localStorage.setItem("themePrimaryColor", color);
    setPrimaryColorState(color);
  }, []);

  const theme = useMemo(
    () => createAppTheme(mode, primaryColor),
    [mode, primaryColor],
  );

  if (!mounted) return null;

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode, primaryColor, setPrimaryColor }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}
