import { todo, todos } from "@/schema/todo";
import { z } from "zod";

export type Todo = z.infer<typeof todo>;
export type Todos = z.infer<typeof todos>;