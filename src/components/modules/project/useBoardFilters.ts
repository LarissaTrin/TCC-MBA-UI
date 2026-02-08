import { useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  boardFilterSchema,
  BoardFilterData,
  BOARD_FILTER_DEFAULTS,
} from "@/common/schemas/boardFilterSchema";
import { Task } from "@/common/model";
import { AutocompleteOption } from "@/common/model";

function isFilterActive(filters: BoardFilterData): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.tags.length > 0 ||
    filters.users.length > 0 ||
    filters.dateFrom !== "" ||
    filters.dateTo !== ""
  );
}

function applyFilters(tasks: Task[], filters: BoardFilterData): Task[] {
  if (!isFilterActive(filters)) return tasks;

  return tasks.filter((task) => {
    // Search: match title or id (case-insensitive)
    if (filters.search.trim()) {
      const term = filters.search.trim().toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(term);
      const matchesId = String(task.id).includes(term);
      if (!matchesTitle && !matchesId) return false;
    }

    // Tags: match subtitle (status) as a proxy — will work with real tag data when available
    if (filters.tags.length > 0) {
      const subtitleLower = (task.subtitle ?? "").toLowerCase();
      const hasMatch = filters.tags.some((tag) =>
        subtitleLower.includes(tag.toLowerCase()),
      );
      if (!hasMatch) return false;
    }

    // Users: match subtitle as a proxy — will work with real user data when available
    if (filters.users.length > 0) {
      const subtitleLower = (task.subtitle ?? "").toLowerCase();
      const hasMatch = filters.users.some((user) =>
        subtitleLower.includes(user.toLowerCase()),
      );
      if (!hasMatch) return false;
    }

    // Date range: overlap check between filter range and task range
    if (filters.dateFrom || filters.dateTo) {
      const taskStart = task.startDate;
      const taskEnd = task.endDate;

      if (filters.dateFrom && taskEnd < filters.dateFrom) return false;
      if (filters.dateTo && taskStart > filters.dateTo) return false;
    }

    return true;
  });
}

function extractTagOptions(tasks: Task[]): AutocompleteOption[] {
  const set = new Set<string>();
  tasks.forEach((t) => {
    if (t.subtitle) set.add(t.subtitle);
  });
  return Array.from(set)
    .sort()
    .map((s) => ({ label: s, value: s }));
}

function extractUserOptions(_tasks: Task[]): AutocompleteOption[] {
  // With the current Task model there's no user field.
  // Return an empty array — this will populate once real data has user info.
  return [];
}

export function useBoardFilters(tasks: Task[]) {
  const form = useForm<BoardFilterData>({
    resolver: zodResolver(boardFilterSchema),
    defaultValues: BOARD_FILTER_DEFAULTS,
  });

  const currentValues = form.watch();

  const filteredTasks = useMemo(
    () => applyFilters(tasks, currentValues),
    [tasks, currentValues],
  );

  const isFiltered = isFilterActive(currentValues);

  const resetFilters = useCallback(() => {
    form.reset(BOARD_FILTER_DEFAULTS);
  }, [form]);

  const handleApply = useCallback(() => {
    // Triggers re-evaluation via watch — no-op needed, values already reactive.
    // Kept as explicit callback so the UI button has a clear action.
  }, []);

  const tagOptions = useMemo(() => extractTagOptions(tasks), [tasks]);
  const userOptions = useMemo(() => extractUserOptions(tasks), [tasks]);

  return {
    form,
    filteredTasks,
    isFiltered,
    resetFilters,
    handleApply,
    tagOptions,
    userOptions,
  };
}
