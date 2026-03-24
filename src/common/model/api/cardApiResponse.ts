import { Category } from "../category";
import { Tag } from "../tag";
import { User } from "../user";

/** Unified backend CardSchema response (camelCase) — A-1 */
export interface CardApiResponse {
  id: number;
  cardNumber: number;
  title: string;
  description?: string;
  priority?: number;
  storyPoints?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  listId?: number;
  userId?: number;
  plannedHours?: number;
  completedHours?: number;
  blocked?: boolean;
  sortOrder?: number;
  categoryId?: number;
  category?: Category;
  createdAt: string;
  updatedAt?: string;
  user?: User;
  tagCards?: {
    id: number;
    tagId: number;
    tag?: Tag;
  }[];
  tasksCard?: {
    id: number;
    title: string;
    date?: string;
    completed: boolean;
    user?: User;
  }[];
  approvers?: {
    id: number;
    environment?: string;
    userId?: number;
    user?: User;
  }[];
  comments?: {
    id: number;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    user?: User;
  }[];
}
