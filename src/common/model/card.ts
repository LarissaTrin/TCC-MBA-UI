import { Status } from "../enum";
export interface Card {
  id: number;
  name: string;
  description?: string;
  status: Status;
  dueDate: string;
  startDate?: string;
  endDate?: string;
  sectionId: string;
  order?: number;
  sortIndex: number;
}
