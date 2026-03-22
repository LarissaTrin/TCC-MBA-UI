import { apiClient } from "./apiClient";
import { Section, Card } from "../model";
import { Status } from "../enum";
import { mapCardsToTasks } from "../utils/cardMapper";
import { Task } from "../model/timeline";
import { CardApiResponse } from "../model/api/cardApiResponse";

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
    sortOrder: card.sortOrder,
    blocked: card.blocked ?? false,
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
   * Fetch sections (lists) without cards — fast initial load.
   * GET /api/projects/{projectId}/lists/
   */
  async getSectionsOnly(projectId: number): Promise<Section[]> {
    if (!projectId) return [];
    const data = await apiClient.get<ListApiResponse[]>(
      `/projects/${projectId}/lists/`,
    );
    return data.map(mapSection);
  },

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
   * Fetch one page of cards for a specific list.
   * GET /api/projects/{projectId}/lists/{listId}/cards
   */
  async getCardsByList(
    projectId: number,
    section: Section,
    page: number,
    limit: number,
  ): Promise<{ cards: Card[]; tasks: Task[]; total: number; page: number; hasMore: boolean }> {
    const res = await apiClient.get<{
      cards: CardApiResponse[];
      total: number;
      page: number;
      has_more: boolean;
    }>(`/projects/${projectId}/lists/${section.id}/cards?page=${page}&limit=${limit}`);

    const fakeList: ListApiResponse = {
      id: Number(section.id),
      name: section.name,
      order: section.order,
      isFinal: section.isFinal ?? false,
    };

    const cards = res.cards.map((card) => mapCardFromList(card, fakeList));
    return {
      cards,
      tasks: mapCardsToTasks(cards),
      total: res.total,
      page: res.page,
      hasMore: res.has_more,
    };
  },

  /**
   * Fetch sections AND all their cards (used by Timeline).
   * Now uses the paginated endpoint with a high limit per list.
   */
  async getListsWithCards(
    projectId: number,
  ): Promise<{ sections: Section[]; cards: Card[] }> {
    const rawSections = await apiClient.get<ListApiResponse[]>(
      `/projects/${projectId}/lists/`,
    );
    const sections = rawSections.map(mapSection);

    const cardArrays = await Promise.all(
      rawSections.map(async (list) => {
        const res = await apiClient.get<{ cards: CardApiResponse[] }>(
          `/projects/${projectId}/lists/${list.id}/cards?page=1&limit=1000`,
        );
        return (res.cards ?? []).map((card) => mapCardFromList(card, list));
      }),
    );

    return { sections, cards: cardArrays.flat() };
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
