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

  async create(projectData: { projectName: string }): Promise<Project> {
    return new Promise((resolve) => {
      // Simula um atraso de rede para a operação de criação
      setTimeout(() => {
        const newProject: Project = {
          id: Math.floor(Math.random() * 10000) + 1, // Gera um ID aleatório
          projectName: projectData.projectName,
        };

        // Adiciona o novo projeto à lista em memória para que
        // chamadas futuras a `getAll()` o incluam.
        PROJECT_BY_USER.push(newProject);

        console.log("API MOCK: Projeto criado ->", newProject);
        resolve(newProject);
      }, 1500);
    });
  },
};
