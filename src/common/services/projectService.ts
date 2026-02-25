import { apiClient } from "./apiClient";
import { Project } from "../model";

/** Backend ProjectSchemaBase response (camelCase via alias_generator) */
interface ProjectApiResponse {
  id: number;
  title: string;
  description: string;
}

function mapProject(p: ProjectApiResponse): Project {
  return {
    id: p.id,
    projectName: p.title,
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
};
