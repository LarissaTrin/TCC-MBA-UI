import { User } from "./user";

export interface Project {
  id: number;
  projectName: string;
}

export interface ProjectRole {
  id: number;
  name: string;
}

export interface ProjectMember {
  id: number;
  userId: number;
  roleId: number;
  user: User;
  role: ProjectRole;
}

export interface ProjectDetail extends Project {
  description: string;
  projectUsers: ProjectMember[];
}

export interface ProjectMemberSearchItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface InviteUserResult {
  email: string;
  registered: boolean;
  alreadyMember: boolean;
}

export interface InviteUsersResponse {
  results: InviteUserResult[];
}
