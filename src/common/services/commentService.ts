import { Comments } from "../model";
import dayjs from "dayjs";

const SIMULATED_DELAY = 300;

function simulateRequest<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), SIMULATED_DELAY);
  });
}

export const commentService = {
  async getByCardId(cardId: number): Promise<Comments[]> {
    return simulateRequest<Comments[]>([]);
  },

  async create(
    cardId: number,
    description: string
  ): Promise<Comments> {
    const newComment: Comments = {
      id: Date.now(),
      description,
      user: { id: 1, firstName: "Current", lastName: "User", email: "" },
      createdAt: dayjs(),
      updatedAt: dayjs(),
    };
    return simulateRequest(newComment);
  },

  async update(
    commentId: number,
    description: string
  ): Promise<Comments> {
    const updated: Comments = {
      id: commentId,
      description,
      user: { id: 1, firstName: "Current", lastName: "User", email: "" },
      createdAt: dayjs(),
      updatedAt: dayjs(),
    };
    return simulateRequest(updated);
  },

  async delete(commentId: number): Promise<void> {
    return simulateRequest(undefined);
  },
};
