import { Status } from "../enum";
import { Approvers } from "./approvers";
import { Category } from "./category";
import { Comments } from "./comments";
import { Tag } from "./tag";
import { TaskCard } from "./tasks";
import { User } from "./user";

export interface Card {
  id: number;
  cardNumber: number;
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
  sortOrder?: number;
  user?: User;
  tasks?: TaskCard[];
  approvers?: Approvers[];
  comments?: Comments[];
  tags?: Tag[];
  blocked?: boolean;
  categoryId?: number;
  category?: Category;
}

export interface CardHistoryEntry {
  id: number;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
  user?: { firstName: string; lastName: string };
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

// ─── Update payload interfaces ────────────────────────────────────────────────

export interface CardUpdateTagPayload {
  tagId?: number;
  name?: string;
}

export interface CardUpdateApproverPayload {
  id?: number;
  environment?: string;
  userId?: number;
}

export interface CardUpdateTaskPayload {
  id?: number;
  title?: string;
  date?: string;
  completed?: boolean;
  userId?: number;
}

export interface CardUpdate {
  title?: string;
  description?: string;
  priority?: number;
  storyPoints?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  listId?: number;
  userId?: number | null;
  sortIndex?: number;
  blocked?: boolean;
  tagCards?: CardUpdateTagPayload[];
  approvers?: CardUpdateApproverPayload[];
  tasksCard?: CardUpdateTaskPayload[];
  categoryId?: number;
}
