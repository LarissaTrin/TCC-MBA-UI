import { useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import {
  boardFilterSchema,
  BoardFilterData,
  BOARD_FILTER_DEFAULTS,
} from "@/common/schemas/boardFilterSchema";
import { Task } from "@/common/model";
import { useProjectMemberSearch, useProjectTagSearch } from "@/common/hooks";

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

    if (filters.tags.length > 0) {
      const taskTagIds = (task.tags ?? []).map((t) => String(t.id));
      const hasMatch = filters.tags.some((selectedId) =>
        taskTagIds.includes(selectedId),
      );
      if (!hasMatch) return false;
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

function parseArrayParam(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

export function useBoardFilters(tasks: Task[], projectId?: number) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<BoardFilterData>({
    resolver: zodResolver(boardFilterSchema),
    defaultValues: {
      search: searchParams.get("search") ?? "",
      tags: parseArrayParam(searchParams.get("tags")),
      users: parseArrayParam(searchParams.get("users")),
      dateFrom: searchParams.get("dateFrom") ?? "",
      dateTo: searchParams.get("dateTo") ?? "",
    },
  });

  const tagSearch = useProjectTagSearch(projectId);
  const memberSearch = useProjectMemberSearch(projectId);

  const appliedFilters: BoardFilterData = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      tags: parseArrayParam(searchParams.get("tags")),
      users: parseArrayParam(searchParams.get("users")),
      dateFrom: searchParams.get("dateFrom") ?? "",
      dateTo: searchParams.get("dateTo") ?? "",
    }),
    [searchParams],
  );

  const filteredTasks = useMemo(
    () => applyFilters(tasks, appliedFilters),
    [tasks, appliedFilters],
  );

  const isFiltered = isFilterActive(appliedFilters);

  const handleApply = useCallback(() => {
    const values = form.getValues();
    const params = new URLSearchParams(searchParams.toString());

    if (values.search) params.set("search", values.search);
    else params.delete("search");

    if (values.tags.length > 0) params.set("tags", values.tags.join(","));
    else params.delete("tags");

    if (values.users.length > 0) params.set("users", values.users.join(","));
    else params.delete("users");

    if (values.dateFrom) params.set("dateFrom", values.dateFrom);
    else params.delete("dateFrom");

    if (values.dateTo) params.set("dateTo", values.dateTo);
    else params.delete("dateTo");

    router.replace(`?${params.toString()}`);
  }, [form, router, searchParams]);

  const resetFilters = useCallback(() => {
    form.reset(BOARD_FILTER_DEFAULTS);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("tags");
    params.delete("users");
    params.delete("dateFrom");
    params.delete("dateTo");
    router.replace(`?${params.toString()}`);
  }, [form, router, searchParams]);

  return {
    form,
    filteredTasks,
    isFiltered,
    resetFilters,
    handleApply,
    tagSearch,
    memberSearch,
  };
}
