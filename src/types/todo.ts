import { addFormSchema, todo, todos } from "@/schema/todo";
import { Dispatch, SetStateAction } from "react";
import { z } from "zod";

export type Todo = z.infer<typeof todo>;
export type Todos = z.infer<typeof todos>;
export type TodoProps = {
    todo: Todo;
    editId: number | undefined;
    setEditId: Dispatch<SetStateAction<number | undefined>>;
    handleDelete:(id:number)=>void;
    handleToggle:(todo:Todo)=>void;
};

export type TodoFormType = z.infer<typeof addFormSchema>