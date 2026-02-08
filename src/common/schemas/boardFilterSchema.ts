import { z } from "zod";

export const boardFilterSchema = z.object({
  search: z.string(),
  tags: z.array(z.string()),
  users: z.array(z.string()),
  dateFrom: z.string(),
  dateTo: z.string(),
});

export type BoardFilterData = z.infer<typeof boardFilterSchema>;

export const BOARD_FILTER_DEFAULTS: BoardFilterData = {
  search: "",
  tags: [],
  users: [],
  dateFrom: "",
  dateTo: "",
};
