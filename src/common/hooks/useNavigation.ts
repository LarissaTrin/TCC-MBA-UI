"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/common/context/LoadingContext";

/**
 * Wraps router.push with the global loading overlay.
 * The overlay shows for 400ms — long enough to cover the typical
 * Next.js client-side route transition.
 */
export function useNavigation() {
  const router = useRouter();
  const { withLoading } = useLoading();

  const navigate = useCallback(
    (path: string) => {
      withLoading(
        () =>
          new Promise<void>((resolve) => {
            router.push(path);
            setTimeout(resolve, 400);
          }),
      );
    },
    [router, withLoading],
  );

  return { navigate };
}
