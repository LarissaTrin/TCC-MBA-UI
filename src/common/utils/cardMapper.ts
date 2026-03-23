import { Card, Task } from "../model";
import { pickColorByStatus } from "./pickColor";

export function mapCardsToTasks(cards: Card[]): Task[] {
  return cards.map((card) => {
    const today = new Date().toISOString().split("T")[0];
    const start = card.startDate ?? today;
    const end = card.endDate ?? today;

    return {
      id: card.id,
      cardNumber: String(card.cardNumber ?? card.sortIndex ?? 0),
      title: card.name,
      subtitle: card.status,
      startDate: start,
      endDate: end,
      color: pickColorByStatus(card),
      sectionId: card.sectionId,
      index: card.sortIndex ?? 0,
      priority: card.priority,
      userId: card.user?.id,
      tags: card.tags ?? [],
      userDisplay: card.user ? `${card.user.firstName} ${card.user.lastName}` : undefined,
      taskTotal: card.tasks?.length ?? 0,
      taskCompleted: card.tasks?.filter((t) => t.completed).length ?? 0,
      blocked: card.blocked ?? false,
      sortOrder: card.sortOrder,
    };
  });
}
