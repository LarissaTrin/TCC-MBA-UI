import { apiClient } from "./apiClient";
import { Comments } from "../model";
import dayjs from "dayjs";

interface CommentApiResponse {
  id: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

function mapComment(c: CommentApiResponse): Comments {
  return {
    id: c.id,
    description: c.description,
    user: c.user ?? { id: 0, firstName: "", lastName: "", email: "" },
    createdAt: c.createdAt ? dayjs(c.createdAt) : dayjs(),
    updatedAt: c.updatedAt ? dayjs(c.updatedAt) : dayjs(),
  };
}

export const commentService = {
  /**
   * Get comments for a card.
   * Comments come as part of the card response (GET /api/cards/{cardId}),
   * so this fetches the card and extracts comments.
   */
  async getByCardId(cardId: number): Promise<Comments[]> {
    const card = await apiClient.get<{
      comments?: CommentApiResponse[];
    }>(`/cards/${cardId}`);
    return (card.comments ?? []).map(mapComment);
  },

  /**
   * Create a comment on a card.
   * POST /api/comments/card/{cardId}
   */
  async create(cardId: number, description: string): Promise<Comments> {
    const data = await apiClient.post<CommentApiResponse>(
      `/comments/card/${cardId}`,
      { description },
    );
    return mapComment(data);
  },

  /**
   * Update a comment.
   * PUT /api/comments/{commentId}
   */
  async update(commentId: number, description: string): Promise<Comments> {
    const data = await apiClient.put<CommentApiResponse>(
      `/comments/${commentId}`,
      { description },
    );
    return mapComment(data);
  },

  /**
   * Delete a comment.
   * DELETE /api/comments/{commentId}
   */
  async delete(commentId: number): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`);
  },
};
