"use client";
import Animation from "@/components/animations";
import FormComponent from "@/components/todo/todo-form";
import {
    FormSkeleton,
    TodoItem,
    TodoItemSkeleton,
} from "@/components/todo/todo-item";
import { useToast } from "@/components/ui/use-toast";
import { myAxios } from "@/lib/data-fetcher";
import { todos } from "@/schema/todo";
import { Todo } from "@/types/todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const Home = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [editId, setEditId] = useState<string | undefined>(undefined);
    const emptyArray = Array(6).fill({});
    const toggleTodo = useMutation({
        mutationFn: async ({
            id,
            completed,
        }: {
            id: string;
            completed: boolean;
        }) => {
            const { data: dt } = await myAxios.patch(`todos/${id}`, {
                completed: !completed,
            });
            return dt;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["todos"]);
        },
    });
    const handleToggle = (todo: Todo) => {
        toggleTodo.mutate(todo);
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
            const { data } = await myAxios.get("todos");
            return todos.parse(data);
            
        },
    });
    const deleteItem = useMutation({
        mutationFn: async (id: string) => {
            await myAxios.delete(`/todos/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["todos"]);
        },
    });
    const handleDelete = (id: string) => {
        deleteItem.mutate(id);
    };
    if (isLoading) {
        return (
            <div>
                <FormSkeleton />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mx-4 md:mx-10 mt-10">
                    {emptyArray.map((_, index) => {
                        return <TodoItemSkeleton key={index} />;
                    })}
                </div>
            </div>
        );
    }
    if (isError) {
        throw new Error(error as string);
    }

    return (
        <>
            <Animation />
            <FormComponent />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mx-4 md:mx-10 mt-10">
                {Todos &&
                    Todos?.map((todo: Todo) => {
                        return (
                            <TodoItem
                                key={todo.id}
                                editId={editId}
                                setEditId={setEditId}
                                todo={todo}
                                handleDelete={handleDelete}
                                handleToggle={handleToggle}
                            />
                        );
                    })}
            </div>
        </>
    );
};
export default Home;
