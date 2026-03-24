import { apiClient } from "./apiClient";
import { AutocompleteOption } from "../types/AutoComplete";
import { InviteUsersResponse, Project, ProjectDetail, ProjectMember, ProjectMemberSearchItem, ProjectRole, User } from "../model";

/** Backend ProjectSchemaBase response (camelCase via alias_generator) */
interface ProjectApiResponse {
  id: number;
  title: string;
  description: string;
}

interface ProjectDetailApiResponse extends ProjectApiResponse {
  projectUsers: Array<{
    id: number;
    userId: number;
    roleId: number;
    user: User;
    role: ProjectRole;
  }>;
}

function mapProject(p: ProjectApiResponse): Project {
  return {
    id: p.id,
    projectName: p.title,
  };
}

function mapProjectDetail(p: ProjectDetailApiResponse): ProjectDetail {
  return {
    id: p.id,
    projectName: p.title,
    description: p.description,
    projectUsers: (p.projectUsers ?? []).map(
      (pu): ProjectMember => ({
        id: pu.id,
        userId: pu.userId,
        roleId: pu.roleId,
        user: pu.user,
        role: pu.role,
      }),
    ),
  };
}

export const projectService = {
  async getAll(): Promise<Project[]> {
    const data = await apiClient.get<ProjectApiResponse[]>("/projects/");
    return data.map(mapProject);
  },

  async getById(id: number): Promise<Project | undefined> {
    try {
      const data = await apiClient.get<ProjectApiResponse>(`/projects/${id}`);
      return mapProject(data);
    } catch {
      return undefined;
    }
  },

  async getDetailById(id: number): Promise<ProjectDetail | undefined> {
    try {
      const data = await apiClient.get<ProjectDetailApiResponse>(`/projects/${id}`);
      return mapProjectDetail(data);
    } catch {
      return undefined;
    }
  },

  async create(projectData: { projectName: string }): Promise<Project> {
    const data = await apiClient.post<ProjectApiResponse>("/projects/", {
      title: projectData.projectName,
      description: "",
    });
    return mapProject(data);
  },

  async update(
    id: number,
    projectData: { projectName?: string; description?: string },
  ): Promise<void> {
    await apiClient.put(`/projects/${id}`, {
      title: projectData.projectName,
      description: projectData.description,
    });
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  async inviteUsers(
    projectId: number,
    invites: { email: string; role: string }[],
  ): Promise<InviteUsersResponse> {
    return apiClient.post<InviteUsersResponse>(
      `/projects/${projectId}/members/invite`,
      { invites },
    );
  },

  async removeMember(projectId: number, userId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/members/${userId}`);
  },

  async updateMemberRole(projectId: number, userId: number, role: string): Promise<void> {
    await apiClient.put(`/projects/${projectId}/members/${userId}`, { role });
  },

  async searchMembers(projectId: number, query: string): Promise<AutocompleteOption[]> {
    const data = await apiClient.get<ProjectMemberSearchItem[]>(
      `/projects/${projectId}/members/search?q=${encodeURIComponent(query)}`,
    );
    return data.map((u) => ({
      value: String(u.id),
      label: `${u.firstName} ${u.lastName}`.trim(),
    }));
  },
};
