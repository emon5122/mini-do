import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { TodoFormType } from "@/types/todo";
import { addFormSchema } from "@/schema/todo";
import { Button } from "../ui/button";
import { DevTool } from "@hookform/devtools";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { myAxios } from "@/lib/data-fetcher";
import { SaveIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const FormComponent = () => {
    const queryClient = new QueryClient();
    const form = useForm<TodoFormType>({
        resolver: zodResolver(addFormSchema),
        defaultValues: {
            todoItem: "",
        },
    });

    const onSubmit = (values: TodoFormType) => {
        addItem.mutate(values.todoItem);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const addItem = useMutation({
        mutationFn: async (title: string) => {
            await myAxios.post("/todos", {
                id: parseInt(Math.random() * 200 + ""), //little trick to do auto id increment, in real scenerio, it will be handled by database
                title: title,
                completed: false,
            });
        },
    });
    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="border-dashed border-2 my-4 flex flex-col justify-center content-center"
                >
                    <FormField
                        control={form.control}
                        name="todoItem"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Todo Item</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg. Go to school at the morning"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter your Todo title.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Tooltip>
                        <TooltipTrigger>
                            <Button type="submit" className="w-64">
                                <SaveIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="capitalize">Saves a new Todo</p>
                        </TooltipContent>
                    </Tooltip>
                </form>
            </Form>
            <DevTool control={form.control} />
        </>
    );
};

export default FormComponent;
