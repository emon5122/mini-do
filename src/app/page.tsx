"use client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import z from "zod";

export default function Home() {
    const { toast } = useToast();
    const posts = z.array(
        z.object({
            id: z.number(),
            title: z.string(),
            body: z.string(),
        })
    );
    const acknowledgement = (title: string, body: string) => {
        toast({
            title: title,
            description: body,
        });
    };
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const { data: dt } = await axios.get(
                "https://jsonplaceholder.typicode.com/posts"
            );
            return posts.parse(dt);
        },
    });
    const empty100array = Array(100).fill(posts);
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
            <main>
                {data &&
                    data?.map((post) => {
                        return (
                            <Card
                                key={post.id}
                                onClick={() =>
                                    acknowledgement(post.title, post.body)
                                }
                            >
                                <CardHeader>
                                    <CardTitle>{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent>{post.body}</CardContent>
                            </Card>
                        );
                    })}
            </main>
        );
    }
}
