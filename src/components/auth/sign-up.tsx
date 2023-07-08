"use client";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { GithubIcon } from "lucide-react";

const SignUp = ({ className }: { className?: string }) => {
    return (
        <div className={cn("", className)}>
            <Card>
                <CardHeader>
                    <CardTitle>Register Yourself</CardTitle>
                    <CardDescription>
                        This page is just a description
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => signIn("github")}>
                        <GithubIcon className="text-black fill-black" />
                    </Button>
                </CardContent>
                <CardFooter>This is the footer</CardFooter>
            </Card>
        </div>
    );
};

export default SignUp;
