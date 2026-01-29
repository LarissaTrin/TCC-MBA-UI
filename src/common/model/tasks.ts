import { Dayjs } from "dayjs";
import { User } from "./user";

export interface Tasks {
  id: number;
  title: string;
  date: Dayjs;
  completed: boolean;
  user: User;
}
