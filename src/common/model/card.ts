import { Status } from "../enum";
import { Approvers } from "./approvers";
import { Comments } from "./comments";
import { Tag } from "./tag";
import { TaskCard } from "./tasks";
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
  tasks?: TaskCard[];
  approvers?: Approvers[];
  comments?: Comments[];
  tags?: Tag[];
  blocked?: boolean;
}

export interface CardHistoryEntry {
  id: number;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface CardDependencyItem {
  id: number;
  cardNumber: number;
  title: string;
}

export interface CardDependenciesResponse {
  dependencies: CardDependencyItem[];
}

export interface CardSearchResult {
  id: number;
  cardNumber: number;
  title: string;
}
