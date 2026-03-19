import { apiClient } from "./apiClient";
import { Section, Card } from "../model";
import { Status } from "../enum";

/** Backend CardSchema response (camelCase) */
interface CardApiResponse {
  id: number;
  cardNumber: number;
  title: string;
  description?: string;
  priority?: number;
  storyPoints?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  listId?: number;
  userId?: number;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  tagCards?: { id: number; tagId: number; tag?: { id: number; name: string } }[];
  tasksCard?: {
    id: number;
    title: string;
    date?: string;
    completed: boolean;
    user?: { id: number; firstName: string; lastName: string; email: string };
  }[];
  approvers?: {
    id: number;
    environment?: string;
    userId?: number;
    user?: { id: number; firstName: string; lastName: string; email: string };
  }[];
  comments?: {
    id: number;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    user?: { id: number; firstName: string; lastName: string; email: string };
  }[];
}

/** Backend ListSchema response (camelCase) */
interface ListApiResponse {
  id: number;
  name: string;
  order: number;
  isFinal: boolean;
  cards?: CardApiResponse[];
}

function mapCardFromList(
  card: CardApiResponse,
  list: ListApiResponse,
): Card {
  return {
    id: card.id,
    name: card.title,
    description: card.description,
    priority: card.priority,
    storyPoints: card.storyPoints,
    status: listStatusFromOrder(list.order),
    dueDate: card.date ? card.date.split("T")[0] : new Date().toISOString().split("T")[0],
    startDate: card.startDate ? card.startDate.split("T")[0] : undefined,
    endDate: card.endDate ? card.endDate.split("T")[0] : undefined,
    sectionId: String(list.id),
    sortIndex: card.cardNumber ?? 0,
    user: card.user,
    tags: card.tagCards
      ?.filter((tc) => tc.tag)
      .map((tc) => ({ id: tc.tag!.id, name: String(tc.tag!.name) })),
    tasks: card.tasksCard?.map((t) => ({
      id: t.id,
      title: t.title,
      date: t.date as unknown as import("dayjs").Dayjs,
      completed: t.completed,
      user: t.user ?? { id: 0, firstName: "", lastName: "", email: "" },
    })),
    approvers: card.approvers?.map((a) => ({
      id: a.id,
      environment: a.environment ?? "",
      user: a.user ?? { id: 0, firstName: "", lastName: "", email: "" },
    })),
  };
}

function listStatusFromOrder(order: number): Status {
  switch (order) {
    case 0:
      return Status.Pending;
    case 1:
      return Status.Pending;
    case 2:
      return Status.InProgress;
    case 3:
      return Status.Validation;
    case 4:
      return Status.Done;
    default:
      return Status.Pending;
  }
}

function mapSection(list: ListApiResponse): Section {
  return {
    id: String(list.id),
    name: list.name,
    order: list.order,
    isFinal: list.isFinal,
  };
}

export const sectionService = {
  /**
   * Fetch sections (lists) for a project.
   * GET /api/projects/{projectId}/lists/
   */
  async getSections(projectId?: number): Promise<Section[]> {
    if (!projectId) return [];
    const data = await apiClient.get<ListApiResponse[]>(
      `/projects/${projectId}/lists/`,
    );
    return data.map(mapSection);
  },

  /**
   * Fetch sections AND their cards in a single request.
   * Returns both mapped sections and flattened cards.
   */
  async getListsWithCards(
    projectId: number,
  ): Promise<{ sections: Section[]; cards: Card[] }> {
    const data = await apiClient.get<ListApiResponse[]>(
      `/projects/${projectId}/lists/`,
    );
    const sections = data.map(mapSection);
    const cards: Card[] = data.flatMap((list) =>
      (list.cards ?? []).map((card) => mapCardFromList(card, list)),
    );
    return { sections, cards };
  },

  /**
   * Create a new list (section) in a project.
   * POST /api/projects/{projectId}/lists/
   */
  async create(
    projectId: number,
    data: { name: string; order?: number },
  ): Promise<Section> {
    const res = await apiClient.post<ListApiResponse>(
      `/projects/${projectId}/lists/`,
      data,
    );
    return mapSection(res);
  },

  /**
   * Update a list (section).
   * PUT /api/projects/{projectId}/lists/{listId}
   */
  async update(
    projectId: number,
    listId: number,
    data: { name?: string; order?: number },
  ): Promise<Section> {
    const res = await apiClient.put<ListApiResponse>(
      `/projects/${projectId}/lists/${listId}`,
      data,
    );
    return mapSection(res);
  },

  /**
   * Delete a list (section).
   * DELETE /api/projects/{projectId}/lists/{listId}
   */
  async deleteSection(projectId: number, listId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/lists/${listId}`);
  },
};
