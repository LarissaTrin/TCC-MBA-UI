"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLoading } from "@/common/context/LoadingContext";

/**
 * Wraps router.push with the global loading overlay.
 * The overlay stays visible until the new route's pathname is confirmed,
 * then waits 50ms so the new page's own useEffect/withLoading calls
 * can increment the count before this one decrements — avoiding a flicker.
 */
export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { withLoading } = useLoading();
  const resolveRef = useRef<(() => void) | null>(null);

  // When pathname changes, the new page has mounted — resolve the navigation promise
  // with a small delay so the new page's withLoading calls start first.
  useEffect(() => {
    if (resolveRef.current) {
      const resolve = resolveRef.current;
      resolveRef.current = null;
      setTimeout(resolve, 50);
    }
  }, [pathname]);

  const navigate = useCallback(
    (path: string) => {
      withLoading(
        () =>
          new Promise<void>((resolve) => {
            resolveRef.current = resolve;
            router.push(path);
            // Safety fallback: resolve after 5s if pathname never changes
            setTimeout(() => {
              if (resolveRef.current === resolve) {
                resolveRef.current = null;
                resolve();
              }
            }, 5000);
          }),
      );
    },
    [router, withLoading],
  );

  return { navigate };
}
