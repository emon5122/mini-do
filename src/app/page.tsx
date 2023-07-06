"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import z from "zod";

export default function Home() {
    const { toast } = useToast();
    const todos = z.array(
        z.object({
            id: z.number(),
            title: z.string(),
            completed: z.boolean(),
        })
    );
    const toggleTodo = useMutation({
        mutationFn: async ({
            id,
            completed,
        }: {
            id: number;
            completed: boolean;
        }) => {
            const { data: dt } = await axios.patch(
                `http://localhost:8000/todos/${id}`,
                { completed: !completed }
            );
            return dt;
        },
    });
    const handleToggle = (title: string, completed: boolean, id: number) => {
        toggleTodo.mutate({ id, completed });
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        toast({
            title: completed ? "Not Completed" : "Completed",
            description: title,
        });
    };
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["todos"],
        queryFn: async () => {
            const { data: dt } = await axios.get(
                "http://localhost:8000/todos/"
            );
            const val = todos.parse(dt);
            return val.reverse();
        },
    });
    const empty100array = Array(100).fill({});
    const queryClient = useQueryClient();
    if (isLoading) {
        return empty100array.map((_, index) => {
            return (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="w-full h-12" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-12" />
                    </CardContent>
                </Card>
            );
        });
    }
    if (isError) {
        throw new Error(error as string);
    }
    if (!isLoading && !isError) {
        return (
            <>
                {data &&
                    data?.map((todo) => {
                        return (
                            <Card key={todo.id}>
                                <CardHeader>
                                    <CardTitle>{todo.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Checkbox
                                        checked={todo.completed}
                                        onCheckedChange={() =>
                                            handleToggle(
                                                todo.title,
                                                todo.completed,
                                                todo.id
                                            )
                                        }
                                    />
                                </CardContent>
                            </Card>
                        );
                    })}
            </>
        );
    }
}
