import { CARDS_BY_USER } from "../mock";
import { Card } from "../model";

export const cardService = {
  async getAll(): Promise<Card[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(CARDS_BY_USER), 2000);
    });
  },

  async getById(id: number): Promise<Card | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CARDS_BY_USER.find((c) => c.id === id));
      }, 500);
    });
  },
};
