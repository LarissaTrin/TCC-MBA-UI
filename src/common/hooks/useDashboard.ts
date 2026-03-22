import { useCallback, useEffect, useState } from "react";

import { useLoading } from "@/common/context/LoadingContext";
import { dashboardService } from "@/common/services";
import { DashboardCard } from "@/common/model/dashboard";

export function useMyDay() {
  const { withLoading } = useLoading();
  const [dueToday, setDueToday] = useState<DashboardCard[]>([]);
  const [overdue, setOverdue] = useState<DashboardCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await withLoading(() => dashboardService.getMyDay());
      setDueToday(data.dueToday);
      setOverdue(data.overdue);
    } catch {
      // silently ignore — panel stays empty on error
    } finally {
      setIsLoading(false);
    }
  }, [withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { dueToday, overdue, isLoading };
}

export function usePendingApprovals() {
  const { withLoading } = useLoading();
  const [pending, setPending] = useState<DashboardCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await withLoading(() => dashboardService.getPendingApprovals());
      setPending(data.pending);
    } catch {
      // silently ignore — panel stays empty on error
    } finally {
      setIsLoading(false);
    }
  }, [withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { pending, isLoading };
}
