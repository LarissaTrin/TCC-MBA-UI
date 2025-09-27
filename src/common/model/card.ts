import { Status } from "../enum";

// src/common/model/card.ts
export interface Card {
  id: number;
  name: string;
  dueDate: string; // ISO date
  status: Status;
}
