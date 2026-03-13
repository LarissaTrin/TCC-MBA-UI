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

export const dashboardService = {
  async getMyDay(): Promise<MyDayResponse> {
    return apiClient.get<MyDayResponse>("/dashboard/my-day");
  },

  async getPendingApprovals(): Promise<PendingApprovalsResponse> {
    return apiClient.get<PendingApprovalsResponse>("/dashboard/pending-approvals");
  },
};
