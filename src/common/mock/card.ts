// src/common/mock/cards.ts
import { Status } from "../enum";
import { Card } from "../model/card";

export const CARDS_BY_USER: Card[] = [
  { id: 1, name: "Implement login page", dueDate: "2025-09-10", status: Status.InProgress },
  { id: 2, name: "Fix API integration bug", dueDate: "2025-09-05", status: Status.Pending },
  { id: 3, name: "Write unit tests", dueDate: "2025-10-01", status: Status.Validation },
  { id: 4, name: "Update user profile screen", dueDate: "2025-09-20", status: Status.InProgress },
  { id: 5, name: "Refactor sidebar component", dueDate: "2025-08-30", status: Status.Pending },
  { id: 6, name: "Create dashboard charts", dueDate: "2025-10-15", status: Status.Validation },
  { id: 7, name: "Fix mobile responsive layout", dueDate: "2025-09-25", status: Status.InProgress },
  { id: 8, name: "Optimize database queries", dueDate: "2025-09-12", status: Status.Pending },
  { id: 9, name: "Migrate legacy API calls", dueDate: "2025-09-28", status: Status.Validation },
  { id: 10, name: "Implement dark mode", dueDate: "2025-10-05", status: Status.InProgress },
  { id: 11, name: "Add forgot password flow", dueDate: "2025-09-07", status: Status.Pending },
  { id: 12, name: "Improve form validation", dueDate: "2025-09-18", status: Status.Validation },
  { id: 13, name: "Setup CI/CD pipeline", dueDate: "2025-10-02", status: Status.InProgress },
  { id: 14, name: "Clean unused dependencies", dueDate: "2025-08-25", status: Status.Pending },
  { id: 15, name: "Translate UI to Spanish", dueDate: "2025-09-22", status: Status.Validation },
  { id: 16, name: "Add user activity logs", dueDate: "2025-09-29", status: Status.InProgress },
  { id: 17, name: "Fix pagination issue", dueDate: "2025-09-06", status: Status.Pending },
  { id: 18, name: "Add unit tests for hooks", dueDate: "2025-10-12", status: Status.Validation },
  { id: 19, name: "Redesign settings page", dueDate: "2025-09-16", status: Status.InProgress },
  { id: 20, name: "Fix CORS configuration", dueDate: "2025-09-08", status: Status.Pending },
  { id: 21, name: "Implement notification system", dueDate: "2025-09-30", status: Status.Validation },
  { id: 22, name: "Migrate icons to Material Symbols", dueDate: "2025-10-07", status: Status.InProgress },
  { id: 23, name: "Fix dropdown menu bug", dueDate: "2025-09-11", status: Status.Pending },
  { id: 24, name: "Optimize image loading", dueDate: "2025-09-27", status: Status.Validation },
  { id: 25, name: "Improve accessibility (a11y)", dueDate: "2025-10-03", status: Status.InProgress },
];
