import { Status } from "../enum";
import { Card } from "../model";

export function pickColorByStatus(card: Card): string {
  switch (card.status) {
    case Status.Pending:
      return "#f97316";
    case Status.InProgress:
      return "#3b82f6";
    case Status.Validation:
      return "#eab308";
    case Status.Done:
      return "#10b981";
    default:
      return "#6b7280";
  }
}
