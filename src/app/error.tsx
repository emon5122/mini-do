"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-1/4 h-1/4 flex flex-col gap-16">
                <CardHeader className="flex items-center justify-center">
                    <CardTitle>{error.name}</CardTitle>
                    <CardDescription>{error.message}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-center">
                    <Button onClick={() => reset()}>Try again</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
