import { useState, useEffect } from "react";
import { Card, Project } from "@/common/model";
import { projectService, sectionService } from "@/common/services";
import { useLoading } from "@/common/context/LoadingContext";

export function useHomePageData() {
  const { withLoading } = useLoading();
  const [projects, setProjects] = useState<Project[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [cardProjectMap, setCardProjectMap] = useState<Record<number, number>>({});
  const [sectionNameMap, setSectionNameMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const projectsData = await withLoading(() => projectService.getAll());
        setProjects(projectsData);

        const allCards: Card[] = [];
        const cardProject: Record<number, number> = {};
        const sectionName: Record<string, string> = {};

        const results = await Promise.allSettled(
          projectsData.map((p) =>
            withLoading(() => sectionService.getListsWithCards(p.id)).then((res) => ({
              projectId: p.id,
              ...res,
            })),
          ),
        );

        for (const result of results) {
          if (result.status === "fulfilled") {
            const { projectId, sections, cards } = result.value;
            for (const card of cards) {
              allCards.push(card);
              cardProject[card.id] = projectId;
            }
            for (const section of sections) {
              sectionName[section.id] = section.name;
            }
          }
        }

        setCards(allCards);
        setCardProjectMap(cardProject);
        setSectionNameMap(sectionName);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [withLoading]);

  return { projects, cards, cardProjectMap, sectionNameMap, isLoading, error };
}
