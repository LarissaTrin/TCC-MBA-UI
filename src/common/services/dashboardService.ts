import { apiClient } from "./apiClient";

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
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface MyDayResponse {
  dueToday: DashboardCard[];
  overdue: DashboardCard[];
}

export interface PendingApprovalsResponse {
  pending: DashboardCard[];
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
  leadTimeDays: number | null;   // avg(completed_at - created_at)
  cycleTimeDays: number | null;  // avg(completed_at - primeiro "moved")
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

export const dashboardService = {
  async getMyDay(): Promise<MyDayResponse> {
    return apiClient.get<MyDayResponse>("/dashboard/my-day");
  },

  async getPendingApprovals(): Promise<PendingApprovalsResponse> {
    return apiClient.get<PendingApprovalsResponse>("/dashboard/pending-approvals");
  },

  async getProjectStats(projectId: number): Promise<ProjectStatsResponse> {
    return apiClient.get<ProjectStatsResponse>(
      `/dashboard/project/${projectId}/stats`,
    );
  },

  async getBurndown(
    projectId: number,
    start: string,
    end: string,
  ): Promise<BurndownResponse> {
    return apiClient.get<BurndownResponse>(
      `/dashboard/project/${projectId}/burndown?start=${start}&end=${end}`,
    );
  },
};
