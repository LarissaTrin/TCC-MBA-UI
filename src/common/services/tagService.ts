import { apiClient } from "./apiClient";
import { Tag } from "../model";

export const tagService = {
  /**
   * Fetch all tags for a project.
   * GET /api/projects/{projectId}/tags
   */
  async getProjectTags(projectId: number, q?: string): Promise<Tag[]> {
    const url = q
      ? `/projects/${projectId}/tags?q=${encodeURIComponent(q)}`
      : `/projects/${projectId}/tags`;
    return apiClient.get<Tag[]>(url);
  },
};
