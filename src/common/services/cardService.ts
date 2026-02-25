import { apiClient } from "./apiClient";
import { Card } from "../model";
import { Status } from "../enum";
import dayjs from "dayjs";

/** Backend CardSchema response (camelCase) */
interface CardApiResponse {
  id: number;
  cardNumber: number;
  title: string;
  description?: string;
  priority?: number;
  storyPoints?: number;
  date?: string;
  listId?: number;
  userId?: number;
  plannedHours?: number;
  completedHours?: number;
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

function mapCard(card: CardApiResponse): Card {
  const dateStr = card.date
    ? card.date.split("T")[0]
    : new Date().toISOString().split("T")[0];

  return {
    id: card.id,
    name: card.title,
    description: card.description,
    priority: card.priority,
    storyPoints: card.storyPoints,
    status: Status.Pending,
    dueDate: dateStr,
    startDate: dateStr,
    endDate: dateStr,
    sectionId: card.listId ? String(card.listId) : "",
    sortIndex: card.cardNumber ?? 0,
    user: card.user,
    tags: card.tagCards
      ?.filter((tc) => tc.tag)
      .map((tc) => ({ id: tc.tag!.id, name: String(tc.tag!.name) })),
    tasks: card.tasksCard?.map((t) => ({
      id: t.id,
      title: t.title,
      date: (t.date ? dayjs(t.date) : dayjs()) as import("dayjs").Dayjs,
      completed: t.completed,
      user: t.user ?? { id: 0, firstName: "", lastName: "", email: "" },
    })),
    approvers: card.approvers?.map((a) => ({
      id: a.id,
      environment: a.environment ?? "",
      user: a.user ?? { id: 0, firstName: "", lastName: "", email: "" },
    })),
    comments: card.comments?.map((c) => ({
      id: c.id,
      description: c.description,
      user: c.user ?? { id: 0, firstName: "", lastName: "", email: "" },
      createdAt: c.createdAt ? dayjs(c.createdAt) : dayjs(),
      updatedAt: c.updatedAt ? dayjs(c.updatedAt) : dayjs(),
    })),
  };
}

export const cardService = {
  /**
   * Get a single card by ID with all relationships.
   * GET /api/cards/{cardId}
   */
  async getById(id: number): Promise<Card | undefined> {
    try {
      const data = await apiClient.get<CardApiResponse>(`/cards/${id}`);
      return mapCard(data);
    } catch {
      return undefined;
    }
  },

  /**
   * Create a card in a specific list (section).
   * POST /api/cards/{listId}
   */
  async create(title: string, listId: number): Promise<Card> {
    const newId = await apiClient.post<number>(`/cards/${listId}`, { title });
    const data = await apiClient.get<CardApiResponse>(`/cards/${newId}`);
    return mapCard(data);
  },

  /**
   * Update a card and its relationships.
   * PUT /api/cards/{cardId}
   */
  async update(
    cardId: number,
    updates: {
      title?: string;
      description?: string;
      priority?: number;
      storyPoints?: number;
      date?: string;
      listId?: number;
    },
  ): Promise<Card> {
    const data = await apiClient.put<CardApiResponse>(
      `/cards/${cardId}`,
      updates,
    );
    return mapCard(data);
  },

  /**
   * Delete a card.
   * DELETE /api/cards/{cardId}
   */
  async delete(cardId: number): Promise<void> {
    await apiClient.delete(`/cards/${cardId}`);
  },
};
