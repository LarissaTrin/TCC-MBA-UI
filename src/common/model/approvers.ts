import { User } from "./user";

export interface Approvers {
  id: number;
  environment: string;
  user: User;
}
