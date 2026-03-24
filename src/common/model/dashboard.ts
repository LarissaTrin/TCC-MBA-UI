import { Category } from "./category";
import { User } from "./user";

export interface DashboardCard {
  id: number;
  cardNumber: number;
  title: string;
  priority?: number;
  date?: string;
  completedAt?: string;
  listId: number;
  listName: string;
  projectId: number;
  projectTitle: string;
  user?: User;
  category?: Category;
}

export interface MyDayResponse {
  dueToday: DashboardCard[];
  overdue: DashboardCard[];
}

export interface PendingApprovalsResponse {
  pending: DashboardCard[];
}

export interface MyCardsResponse {
  assigned: DashboardCard[];
  dueToday: DashboardCard[];
  overdue: DashboardCard[];
  pendingApprovals: DashboardCard[];
}

export interface ListDistribution {
  listName: string;
  isFinal: boolean;
  count: number;
}

export interface PriorityDistribution {
  priority: number | null;
  count: number;
}

export interface TagDistribution {
  tagName: string;
  count: number;
}

export interface ProjectStatsResponse {
  totalCards: number;
  byList: ListDistribution[];
  byPriority: PriorityDistribution[];
  byTag: TagDistribution[];
  leadTimeDays: number | null;
  cycleTimeDays: number | null;
}

export interface BurndownPoint {
  date: string;
  remaining: number;
  ideal: number;
}

export interface BurndownResponse {
  start: string;
  end: string;
  total: number;
  points: BurndownPoint[];
}
