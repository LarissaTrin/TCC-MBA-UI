import { useState, useEffect } from "react";
import { Card, Project } from "@/common/model";
import { projectService, sectionService } from "@/common/services";

export function useHomePageData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // 1. Fetch all projects for the current user
        const projectsData = await projectService.getAll();
        setProjects(projectsData);

        // 2. For each project, fetch lists with cards and flatten
        const allCards: Card[] = [];
        const results = await Promise.allSettled(
          projectsData.map((p) => sectionService.getListsWithCards(p.id)),
        );
        for (const result of results) {
          if (result.status === "fulfilled") {
            allCards.push(...result.value.cards);
          }
        }
        setCards(allCards);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { projects, cards, isLoading, error };
}
