import { z } from "zod";

export const todo = z.object({
    id: z.number(),
    title: z.string(),
    completed: z.boolean(),
});
export const todos = z.array(todo);