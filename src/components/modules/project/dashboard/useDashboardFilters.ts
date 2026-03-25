import { useCallback, useState } from "react";
import dayjs from "dayjs";

const getDefaultStart = () => dayjs().subtract(13, "day").format("YYYY-MM-DD");
const getDefaultEnd = () => dayjs().format("YYYY-MM-DD");

export interface DashboardFilterValues {
  start: string;
  end: string;
}

export function useDashboardFilters() {
  // Committed state used by queries
  const [applied, setApplied] = useState<DashboardFilterValues>({
    start: getDefaultStart(),
    end: getDefaultEnd(),
  });

  // Draft state that lives in the popover before the user confirms
  const [draft, setDraft] = useState<DashboardFilterValues>({
    start: getDefaultStart(),
    end: getDefaultEnd(),
  });

  const isFiltered =
    applied.start !== getDefaultStart() || applied.end !== getDefaultEnd();

  const onApply = useCallback(() => {
    setApplied({ ...draft });
  }, [draft]);

  const onClear = useCallback(() => {
    const reset = { start: getDefaultStart(), end: getDefaultEnd() };
    setDraft(reset);
    setApplied(reset);
  }, []);

  const setDraftStart = useCallback((v: string) => {
    setDraft((prev) => ({ ...prev, start: v }));
  }, []);

  const setDraftEnd = useCallback((v: string) => {
    setDraft((prev) => ({ ...prev, end: v }));
  }, []);

  return {
    applied,
    draft,
    isFiltered,
    setDraftStart,
    setDraftEnd,
    onApply,
    onClear,
  };
}
