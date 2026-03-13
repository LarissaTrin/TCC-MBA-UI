"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface LoadingContextType {
  isLoading: boolean;
  /**
   * Wraps an async function with global loading state.
   * Supports concurrent calls — the overlay stays until all finish.
   *
   * @example
   * const { withLoading } = useLoading();
   * const result = await withLoading(() => apiClient.post(...));
   */
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  withLoading: (fn) => fn(),
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const isLoading = count > 0;

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setCount((c) => c + 1);
    try {
      return await fn();
    } finally {
      setCount((c) => c - 1);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, withLoading }}>
      {children}
      <Backdrop open={isLoading} sx={{ zIndex: 9999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
