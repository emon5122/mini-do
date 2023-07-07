"use client";
import { TodoItem, TodoItemSkeleton } from "@/components/todo/todo-item";
import { useToast } from "@/components/ui/use-toast";
import { myAxios } from "@/lib/data-fetcher";
import { todos } from "@/schema/todo";
import { Todo } from "@/types/todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const Home = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [editId, setEditId] = useState<number>();
    const emptyArray = Array(10).fill({});

    const updateTodo = useMutation({
        mutationFn: async (todo: Todo) => {
            const { data: dt } = await myAxios.put(`todos/${todo.id}`, {
                title: todo.title,
                completed: todo.completed,
            });
            return dt;
        },
    });
    const handleUpdate = (todo: Todo) => {
        updateTodo.mutate(todo);
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        setEditId(0);
        toast({
            title: todo.completed ? "Not Completed" : "Completed",
            description: todo.title,
        });
    };

    const {
        data: Todos,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["todos"],
        queryFn: async () => {
            const { data } = await myAxios.get("todos/");
            const val = todos.parse(data);
            return val.reverse();
        },
    });

    if (isLoading) {
        return emptyArray.map((_, index) => {
            return <TodoItemSkeleton key={index} />;
        });
    }
    if (isError) {
        throw new Error(error as string);
    }

    return (
        <>
            {Todos &&
                Todos?.map((todo: Todo) => {
                    return (
                        <TodoItem
                            key={todo.id}
                            editId={editId}
                            setEditId={setEditId}
                            handleUpdate={handleUpdate}
                            todo={todo}
                        />
                    );
                })}
        </>
    );
};
export default Home;
