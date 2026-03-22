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
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  tagCards?: {
    id: number;
    tagId: number;
    tag?: { id: number; name: string };
  }[];
  tasksCard?: {
    id: number;
    title: string;
    date?: string;
    completed: boolean;
    user?: { id: number; firstName: string; lastName: string; email: string };
  }[];
  approvers?: {
    id: number;
    environment?: string;
    userId?: number;
    user?: { id: number; firstName: string; lastName: string; email: string };
  }[];
  comments?: {
    id: number;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    user?: { id: number; firstName: string; lastName: string; email: string };
  }[];
}
