import { Dayjs } from "dayjs";
import { User } from "./user";

export interface TaskCard {
  id: number;
  title: string;
  date: Dayjs;
  completed: boolean;
  user: User;
}
