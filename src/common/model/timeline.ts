export interface Task {
  id: number | string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  color: string;
  sectionId: string;
  index: number;
  priority?: number;
  userId?: number;
  tags?: { id: number; name: string }[];
  userDisplay?: string;
  taskTotal?: number;
  taskCompleted?: number;
  blocked?: boolean;
  sortOrder?: number;
}

export interface Month {
  year: number;
  month: number;
  days: number[];
}