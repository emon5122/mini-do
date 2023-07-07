import { Delete, Edit, Save, SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";
import { TodoFormType, TodoProps } from "@/types/todo";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { addFormSchema } from "@/schema/todo";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { myAxios } from "@/lib/data-fetcher";

export const TodoItem = (props: TodoProps) => {
    const queryClient = new QueryClient();
    const form = useForm<TodoFormType>({
        resolver: zodResolver(addFormSchema),
        defaultValues: {
            todoItem: "",
        },
    });
    const updateTodo = useMutation({
        mutationFn: async ({ id, title }: { id: number; title: string }) => {
            const { data: dt } = await myAxios.patch(`todos/${id}`, {
                title,
            });
            return dt;
        },
    });
    const handleUpdate = ({ id, title }: { id: number; title: string }) => {
        updateTodo.mutate({ id, title });
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        props.setEditId(0);
    };
    const onSubmit = (values: TodoFormType) => {
        const data = { id: props.todo.id, title: values.todoItem };
        handleUpdate(data);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["todos"] });
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-row gap-2">
                    {props.editId === props.todo.id ? (
                        <>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="flex justify-between gap-2"
                                >
                                    <FormField
                                        control={form.control}
                                        name="todoItem"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="eg. Go to school at the morning"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button type="submit">
                                                <SaveIcon />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="capitalize">
                                                Updates to this new todo
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </form>
                            </Form>
                            <DevTool control={form.control} />
                        </>
                    ) : (
                        <>
                            {props.todo.completed ? (
                                <p className="line-through">
                                    {props.todo.title}
                                </p>
                            ) : (
                                <p>{props.todo.title}</p>
                            )}
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        variant={"secondary"}
                                        onClick={() =>
                                            props.setEditId(props.todo.id)
                                        }
                                    >
                                        <Edit />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="capitalize">Edit Title</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        variant={"destructive"}
                                        onClick={() =>
                                            props.handleDelete(props.todo.id)
                                        }
                                    >
                                        <Delete />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="capitalize">
                                        Delete this todo
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tooltip>
                    <TooltipTrigger>
                        <Checkbox
                            checked={props.todo.completed}
                            onCheckedChange={() =>
                                props.handleToggle(props.todo)
                            }
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="capitalize">
                            Toggle to change completion status
                        </p>
                    </TooltipContent>
                </Tooltip>
            </CardContent>
        </Card>
    );
};

export const TodoItemSkeleton = () => {
    return (
        <Card>
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
};
