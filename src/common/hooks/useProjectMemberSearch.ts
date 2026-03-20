"use client";

import { useCallback, useRef, useState } from "react";
import { AutocompleteOption } from "@/common/types/AutoComplete";
import { projectService } from "@/common/services";

export function useProjectMemberSearch(projectId: number | undefined) {
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!projectId || query.trim().length < 1) {
        setOptions([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await projectService.searchMembers(projectId, query);
          setOptions(results);
        } catch {
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [projectId],
  );

  const seedOption = useCallback((option: AutocompleteOption) => {
    setOptions((prev) => {
      if (prev.some((o) => o.value === option.value)) return prev;
      return [option, ...prev];
    });
  }, []);

  return { options, loading, search, seedOption };
}
