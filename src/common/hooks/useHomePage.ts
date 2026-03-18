import { useState, useEffect } from "react";
import { Project } from "@/common/model";
import { dashboardService, DashboardCard, projectService } from "@/common/services";
import { useLoading } from "@/common/context/LoadingContext";

export function useHomePageData() {
  const { withLoading } = useLoading();

  const [projects, setProjects] = useState<Project[]>([]);
  const [assignedCards, setAssignedCards] = useState<DashboardCard[]>([]);
  const [dueTodayCards, setDueTodayCards] = useState<DashboardCard[]>([]);
  const [overdueCards, setOverdueCards] = useState<DashboardCard[]>([]);
  const [pendingApprovalCards, setPendingApprovalCards] = useState<DashboardCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const [projectsData, myCards] = await Promise.all([
          withLoading(() => projectService.getAll()),
          withLoading(() => dashboardService.getMyCards()),
        ]);

        setProjects(projectsData);
        setAssignedCards(myCards.assigned);
        setDueTodayCards(myCards.dueToday);
        setOverdueCards(myCards.overdue);
        setPendingApprovalCards(myCards.pendingApprovals);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [withLoading]);

  // Build sectionNameMap from the cards returned by the API (listId → listName)
  const sectionNameMap: Record<string, string> = {};
  for (const card of [...assignedCards, ...pendingApprovalCards]) {
    sectionNameMap[String(card.listId)] = card.listName;
  }

  return {
    projects,
    assignedCards,
    dueTodayCards,
    overdueCards,
    pendingApprovalCards,
    sectionNameMap,
    isLoading,
    error,
  };
}
