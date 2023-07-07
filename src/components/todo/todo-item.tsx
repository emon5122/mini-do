import { Edit, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";

export const TodoItem = (props: any) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-row gap-2">
                    {props.editId === props.todo.id ? (
                        <>
                            <Input
                                placeholder={props.todo.title}
                                onChange={(
                                    e // TODO: Need to change
                                ) => console.log("first")}
                            />
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        variant={"secondary"}
                                        onClick={() =>
                                            props.handleUpdate(props.todo)
                                        }
                                    >
                                        <Save />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="capitalize">
                                        Updates to new title
                                    </p>
                                </TooltipContent>
                            </Tooltip>
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
                                // TODO: Need to handle this
                                console.log("first")
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
