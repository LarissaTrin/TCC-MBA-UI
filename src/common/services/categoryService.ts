import { apiClient } from "./apiClient";
import { Category } from "../model/category";

export type { Category };

export const categoryService = {
  /** Fetches all available categories. GET /api/categories/ */
  async list(): Promise<Category[]> {
    return apiClient.get<Category[]>("/categories/");
  },
};
