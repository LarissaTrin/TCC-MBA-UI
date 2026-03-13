import { useState, useEffect } from "react";
import { Card, Project } from "@/common/model";
import { projectService, sectionService } from "@/common/services";
import { useLoading } from "@/common/context/LoadingContext";

export function useHomePageData() {
  const { withLoading } = useLoading();
  const [projects, setProjects] = useState<Project[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const projectsData = await withLoading(() => projectService.getAll());
        setProjects(projectsData);

        const allCards: Card[] = [];
        const results = await Promise.allSettled(
          projectsData.map((p) =>
            withLoading(() => sectionService.getListsWithCards(p.id)),
          ),
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
  }, [withLoading]);

  return { projects, cards, isLoading, error };
}
