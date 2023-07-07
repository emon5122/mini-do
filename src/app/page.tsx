"use client";
import FormComponent from "@/components/todo/todo-form";
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
    const toggleTodo = useMutation({
        mutationFn: async ({
            id,
            completed,
        }: {
            id: number;
            completed: boolean;
        }) => {
            const { data: dt } = await myAxios.patch(
                `http://localhost:8000/todos/${id}`,
                { completed: !completed }
            );
            return dt;
        },
    });
    const handleToggle = (todo: Todo) => {
        toggleTodo.mutate(todo);
        queryClient.invalidateQueries({ queryKey: ["todos"] });
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
    const deleteItem = useMutation({
        mutationFn: async (id: number) => {
            await myAxios.delete(`/todos/${id}`);
        },
    });
    const handleDelete = (id: number) => {
        deleteItem.mutate(id);
        queryClient.invalidateQueries({ queryKey: ["todos"] });
    };
    if (isLoading) {
        return (
            <>
                <FormComponent />
                {emptyArray.map((_, index) => {
                    return <TodoItemSkeleton key={index} />;
                })}
            </>
        );
    }
    if (isError) {
        throw new Error(error as string);
    }

    return (
        <>
            <FormComponent />
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
        </>
    );
};
export default Home;
