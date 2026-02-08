import { CARDS_BY_USER } from "../mock";
import { Card } from "../model";
import { Status } from "../enum";

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

  async create(title: string): Promise<Card> {
    const today = new Date().toISOString().split("T")[0];
    const newCard: Card = {
      id: Date.now(),
      name: title,
      status: Status.Pending,
      dueDate: today,
      startDate: today,
      endDate: today,
      sectionId: "backlog",
      sortIndex: 0,
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        CARDS_BY_USER.push(newCard);
        resolve(newCard);
      }, 300);
    });
  },
};
