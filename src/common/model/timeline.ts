export interface Task {
  id: number | string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  color: string;
  sectionId: string;
  index: number;
}

export interface Month {
  year: number;
  month: number;
  days: number[];
}