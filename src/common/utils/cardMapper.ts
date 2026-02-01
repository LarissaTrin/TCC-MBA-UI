import { Card, Task } from "../model";
import { pickColorByStatus } from "./pickColor";

export function mapCardsToTasks(cards: Card[]): Task[] {
  return cards.map((card) => {
    const start = card.startDate ?? card.dueDate;
    const end = card.endDate ?? card.dueDate;

    return {
      id: card.id,
      title: card.name,
      subtitle: card.status,
      startDate: start,
      endDate: end,
      color: pickColorByStatus(card),
      sectionId: card.sectionId,
      index: card.sortIndex ?? 0,
    };
  });
}
