import { z } from "zod";

const taskItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  date: z.string().optional(),
  completed: z.boolean(),
  userName: z.string().optional(),
  userId: z.string().optional(),
});

const approverItemSchema = z.object({
  id: z.number(),
  environment: z.string().min(1, "Ambiente obrigatório"),
  userName: z.string().optional(),
  userId: z.string().optional(),
});

const tagItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
});

export const cardSchema = z.object({
  id: z.number().min(1, "ID é obrigatório"),
  name: z.string().min(1, "Nome não pode estar vazio"),
  description: z.string().optional(),
  user: z.string().optional(),
  status: z.string().optional(),
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  priority: z.string().regex(/^\d*$/).optional(),
  storyPoints: z.string().regex(/^\d*$/).optional(),
  sectionId: z.string().min(1, "Section não pode estar vazio"),
  tasks: z.array(taskItemSchema),
  approvers: z.array(approverItemSchema),
  tags: z.array(tagItemSchema),
});

export type CardFormData = z.infer<typeof cardSchema>;
export type TaskItemFormData = z.infer<typeof taskItemSchema>;
export type ApproverItemFormData = z.infer<typeof approverItemSchema>;
export type TagItemFormData = z.infer<typeof tagItemSchema>;
