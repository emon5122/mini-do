import { z } from "zod";

export const todo = z.object({
    id: z.number(),
    title: z.string(),
    completed: z.boolean(),
});
export const todos = z.array(todo);

export const addFormSchema = z.object({
    todoItem: z.string().min(5, {
      message: "Todo must be at least 5 characters.",
    }),
  })