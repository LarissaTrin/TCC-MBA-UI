import { Status } from "../enum";
import { Approvers } from "./approvers";
import { Comments } from "./comments";
import { Tag } from "./tag";
import { Tasks } from "./tasks";
import { User } from "./user";
export interface Card {
  id: number;
  name: string;
  description?: string;
  priority?: number;
  storyPoints?: number;
  status: Status;
  dueDate: string;
  startDate?: string;
  endDate?: string;
  completedAt?: string | null;
  sectionId: string;
  order?: number;
  sortIndex: number;
  user?: User;
  tasks?: Tasks[];
  approvers?: Approvers[];
  comments?: Comments[];
  tags?: Tag[];
}
