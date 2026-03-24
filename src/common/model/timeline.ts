import { Category } from "./category";
import { Tag } from "./tag";

export interface Task {
  id: number | string;
  title: string;
  cardNumber: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  color: string;
  sectionId: string;
  index: number;
  priority?: number;
  userId?: number;
  tags?: Tag[];
  userDisplay?: string;
  taskTotal?: number;
  taskCompleted?: number;
  blocked?: boolean;
  sortOrder?: number;
  category?: Category;
}

export interface Month {
  year: number;
  month: number;
  days: number[];
}
