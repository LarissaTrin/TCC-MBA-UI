import { apiClient } from "./apiClient";
import {
  DashboardCard,
  MyDayResponse,
  PendingApprovalsResponse,
  MyCardsResponse,
  ListDistribution,
  PriorityDistribution,
  TagDistribution,
  ProjectStatsResponse,
  BurndownPoint,
  BurndownResponse,
} from "../model/dashboard";

// Re-export from model for backward compatibility
export type {
  DashboardCard,
  MyDayResponse,
  PendingApprovalsResponse,
  MyCardsResponse,
  ListDistribution,
  PriorityDistribution,
  TagDistribution,
  ProjectStatsResponse,
  BurndownPoint,
  BurndownResponse,
} from "../model/dashboard";

export const dashboardService = {
  async getMyCards(): Promise<MyCardsResponse> {
    return apiClient.get<MyCardsResponse>("/dashboard/my-cards");
  },

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
