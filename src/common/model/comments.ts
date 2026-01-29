import { Dayjs } from "dayjs";
import { User } from "./user";

export interface Comments {
  id: number;
  description: string;
  user: User;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}
