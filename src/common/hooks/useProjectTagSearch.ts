"use client";

import { useCallback, useRef, useState } from "react";
import { AutocompleteOption } from "@/common/types/AutoComplete";
import { tagService } from "@/common/services";

export function useProjectTagSearch(projectId: number | undefined) {
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Fetch all project tags once. Subsequent calls are no-ops unless force=true.
   */
  const load = useCallback(
    async (force = false) => {
      if (!projectId || (loaded && !force)) return;
      setLoading(true);
      try {
        const tags = await tagService.getProjectTags(projectId);
        setOptions(tags.map((t) => ({ label: t.name, value: String(t.id) })));
        setLoaded(true);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [projectId, loaded],
  );

  /**
   * Debounced search by name. On empty query, reloads all tags.
   */
  const search = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!projectId) return;

      if (!query.trim()) {
        load(true);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const tags = await tagService.getProjectTags(projectId, query);
          setOptions(tags.map((t) => ({ label: t.name, value: String(t.id) })));
        } catch {
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [projectId, load],
  );

  return { options, loading, load, search };
}
