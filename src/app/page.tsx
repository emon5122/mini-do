"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import z from "zod";

export default function Home() {
    const { toast } = useToast();
    const [editId, setEditId] = useState<number>();
    const [newTitle, setNewTitle] = useState<string>();
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
    const updateTodo = useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const { data: dt } = await axios.patch(
                `http://localhost:8000/todos/${id}`,
                { title: newTitle }
            );
            return dt;
        },
    });
    const handleSave = (id: number) => {
        updateTodo.mutate({ id });
        setEditId(0);
        setNewTitle("");
    };
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
    const emptyArray = Array(10).fill({});
    const queryClient = useQueryClient();
    if (isLoading) {
        return emptyArray.map((_, index) => {
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
                                    <CardTitle className="flex flex-row gap-2">
                                        {editId === todo.id ? (
                                            <>
                                                <Input
                                                    placeholder={todo.title}
                                                    onChange={(e) =>
                                                        setNewTitle(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    variant={"secondary"}
                                                    onClick={() =>
                                                        handleSave(todo.id)
                                                    }
                                                >
                                                    <Image
                                                        width="12"
                                                        height="64"
                                                        src={
                                                            "https://img.icons8.com/ios/100/save--v1.png"
                                                        }
                                                        alt="save"
                                                    />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <p>{todo.title}</p>
                                                <Button
                                                    variant={"secondary"}
                                                    onClick={() =>
                                                        setEditId(todo.id)
                                                    }
                                                >
                                                    <Image
                                                        width="12"
                                                        height="64"
                                                        src={
                                                            "https://img.icons8.com/wired/64/pencil.png"
                                                        }
                                                        alt="edit"
                                                    />
                                                </Button>
                                            </>
                                        )}
                                    </CardTitle>
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
