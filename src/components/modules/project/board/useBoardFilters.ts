import { useMemo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  boardFilterSchema,
  BoardFilterData,
  BOARD_FILTER_DEFAULTS,
} from "@/common/schemas/boardFilterSchema";
import { Task } from "@/common/model";
import { AutocompleteOption } from "@/common/model";
import { useProjectMemberSearch } from "@/common/hooks";

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
    if (filters.search.trim()) {
      const term = filters.search.trim().toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(term);
      const matchesId = String(task.id).includes(term);
      if (!matchesTitle && !matchesId) return false;
    }

    if (filters.users.length > 0) {
      if (!task.userId || !filters.users.includes(String(task.userId))) {
        return false;
      }
    }

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

export function useBoardFilters(tasks: Task[], projectId?: number) {
  const form = useForm<BoardFilterData>({
    resolver: zodResolver(boardFilterSchema),
    defaultValues: BOARD_FILTER_DEFAULTS,
  });

  // Bug 4: filtros só aplicados ao clicar em Apply — não reativo
  const [appliedFilters, setAppliedFilters] = useState<BoardFilterData>(BOARD_FILTER_DEFAULTS);

  const filteredTasks = useMemo(
    () => applyFilters(tasks, appliedFilters),
    [tasks, appliedFilters],
  );

  const isFiltered = isFilterActive(appliedFilters);

  const handleApply = useCallback(() => {
    setAppliedFilters(form.getValues());
  }, [form]);

  const resetFilters = useCallback(() => {
    form.reset(BOARD_FILTER_DEFAULTS);
    setAppliedFilters(BOARD_FILTER_DEFAULTS);
  }, [form]);

  const tagOptions = useMemo(() => extractTagOptions(tasks), [tasks]);
  const memberSearch = useProjectMemberSearch(projectId);

  return {
    form,
    filteredTasks,
    isFiltered,
    resetFilters,
    handleApply,
    tagOptions,
    memberSearch,
  };
}
