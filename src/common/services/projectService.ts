import { PROJECT_BY_USER } from "../mock";
import { Project } from "../model";

/**
 * Service para simular API de projetos.
 * Posteriormente pode ser substituído por chamadas reais à API Python (fetch/axios).
 */
export const projectService = {
  async getAll(): Promise<Project[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(PROJECT_BY_USER), 3000);
    });
  },

  async getById(id: number): Promise<Project | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(PROJECT_BY_USER.find((p) => p.id === id));
      }, 300);
    });
  },
};
