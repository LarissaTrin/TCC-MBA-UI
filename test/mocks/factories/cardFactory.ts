import { Status } from "@/common/enum/status";
import type { Card } from "@/common/model/card";
import { buildUser } from "./userFactory";

let _idCounter = 1;

export function buildCard(overrides: Partial<Card> = {}): Card {
  const id = overrides.id ?? _idCounter++;
  return {
    id,
    name: `Card ${id}`,
    status: Status.Pending,
    dueDate: "2026-12-31",
    sectionId: "1",
    sortIndex: id,
    user: buildUser({ id }),
    tags: [],
    tasks: [],
    blocked: false,
    ...overrides,
  };
}

export function buildCardList(
  count: number,
  overrides: Partial<Card> = {}
): Card[] {
  return Array.from({ length: count }, (_, i) =>
    buildCard({ id: i + 1, ...overrides })
  );
}
