import { Section } from "../model";

export const sectionService = {
  async getSections(): Promise<Section[]> {
    return [
      { id: "backlog", name: "Não iniciados", order: 0 },
      { id: "todo", name: "A Fazer", order: 1 },
      { id: "doing", name: "Em andamento", order: 2 },
      { id: "validation", name: "Em validação", order: 3 },
      { id: "done", name: "Concluído", order: 4, isFinal: true },
    ];
  },
};
