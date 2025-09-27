import { useState, useEffect } from "react";
import { Card, Project } from "@/common/model";
import { cardService, projectService } from "@/common/services";

export function useHomePageData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [projectsData, cardsData] = await Promise.all([
          projectService.getAll(),
          cardService.getAll(),
        ]);
        setProjects(projectsData);
        setCards(cardsData);
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
