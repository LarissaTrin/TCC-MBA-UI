import { apiClient } from "./apiClient";
import { Card } from "../model";
import {
  CardHistoryEntry,
  CardDependenciesResponse,
  CardSearchResult,
} from "../model/card";
import { CardApiResponse } from "../model/api/cardApiResponse";
import { Status } from "../enum";
import dayjs from "dayjs";

function mapCard(card: CardApiResponse): Card {
  const today = new Date().toISOString().split("T")[0];
  const dateStr = card.date ? card.date.split("T")[0] : today;
  const startDateStr = card.startDate ? card.startDate.split("T")[0] : dateStr;
  const endDateStr = card.endDate ? card.endDate.split("T")[0] : dateStr;

  return {
    id: card.id,
    cardNumber: card.cardNumber,
    name: card.title,
    description: card.description,
    priority: card.priority,
    storyPoints: card.storyPoints,
    status: Status.Pending,
    dueDate: dateStr,
    startDate: startDateStr,
    endDate: endDateStr,
    sectionId: card.listId ? String(card.listId) : "",
    sortIndex: card.cardNumber ?? 0,
    sortOrder: card.sortOrder,
    blocked: card.blocked ?? false,
    categoryId: card.categoryId,
    category: card.category,
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

// Re-export from model for backward compatibility
export type { CardHistoryEntry, CardDependencyItem, CardDependenciesResponse, CardSearchResult } from "../model/card";

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
      startDate?: string;
      endDate?: string;
      listId?: number;
      userId?: number;
      sortIndex?: number;
      blocked?: boolean;
      tagCards?: { tagId?: number; name?: string }[];
      approvers?: { id?: number; environment?: string; userId?: number }[];
      tasksCard?: { id?: number; title?: string; date?: string; completed?: boolean; userId?: number }[];
      categoryId?: number;
    },
  ): Promise<Card> {
    const data = await apiClient.put<CardApiResponse>(
      `/cards/${cardId}`,
      updates,
    );
    return mapCard(data);
  },

  /**
   * Bulk reorder cards (saves sort_order for multiple cards at once).
   * PUT /api/cards/reorder
   */
  async reorder(items: { cardId: number; sortOrder: number }[]): Promise<void> {
    await apiClient.put("/cards/reorder", { items });
  },

  /**
   * Delete a card.
   * DELETE /api/cards/{cardId}
   */
  async delete(cardId: number): Promise<void> {
    await apiClient.delete(`/cards/${cardId}`);
  },

  /**
   * Get history events for a card.
   * GET /api/cards/{cardId}/history
   */
  async getHistory(cardId: number): Promise<CardHistoryEntry[]> {
    return apiClient.get<CardHistoryEntry[]>(`/cards/${cardId}/history`);
  },

  /**
   * Search cards by title or card number (up to 10 results).
   * GET /api/cards/search?q=...&project_id=...
   */
  async searchCards(
    q: string,
    projectId?: number,
  ): Promise<CardSearchResult[]> {
    const params = new URLSearchParams({ q });
    if (projectId) params.append("project_id", String(projectId));
    return apiClient.get<CardSearchResult[]>(
      `/cards/search?${params.toString()}`,
    );
  },

  /**
   * Get dependencies for a card.
   * GET /api/cards/{cardId}/dependencies
   */
  async getDependencies(cardId: number): Promise<CardDependenciesResponse> {
    return apiClient.get<CardDependenciesResponse>(
      `/cards/${cardId}/dependencies`,
    );
  },

  /**
   * Add a related card as a dependency.
   * POST /api/cards/{cardId}/dependencies
   */
  async addDependency(cardId: number, relatedCardId: number): Promise<void> {
    await apiClient.post(`/cards/${cardId}/dependencies`, { relatedCardId });
  },

  /**
   * Remove a dependency from a card.
   * DELETE /api/cards/{cardId}/dependencies/{relatedCardId}
   */
  async removeDependency(cardId: number, relatedCardId: number): Promise<void> {
    await apiClient.delete(`/cards/${cardId}/dependencies/${relatedCardId}`);
  },
};
