import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";
import Provider from "../context/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import { Heart } from "lucide-react";
import AuthProvider from "@/context/AuthProvider";

export const metadata = {
    title: "Mini-Do",
    description: "Simplistic To-Do App",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                    >
                        <div>
                            <div
                                className="flex justify-between py-2 bg-accent/10 items-center fixed top-0 w-full  rounded-b-md backdrop-blur-[2px]"
                                style={{ boxShadow: ".5em -0.001em 1em" }}
                            >
                                <h1 className="text-center font-extrabold ml-10 text-xl">
                                    <Link href="/"> Mini-Do </Link>
                                </h1>
                                <ModeToggle />
                            </div>
                            <main className="mt-20 mb-20">
                                <Provider>
                                    <TooltipProvider>
                                        {children}
                                    </TooltipProvider>
                                </Provider>
                            </main>
                        </div>
                        <Toaster />
                    </ThemeProvider>
                    <footer
                        style={{ boxShadow: ".5em -0.001em 1em" }}
                        className="flex justify-center py-2 bg-accent/10 mt-4 bottom-0 fixed w-full rounded-t-md backdrop-blur-[2px]"
                    >
                        <p className="flex flex-row gap-2">
                            Made with{" "}
                            {
                                <Heart className="text-destructive fill-destructive" />
                            }
                            by
                            <Link href={"https://ihemon.me"}>
                                <span className="hover:text-primary/40 transition-all duration-300 ease-in-out">
                                    Istiak Hassan Emon
                                </span>
                            </Link>
                        </p>
                    </footer>
                </AuthProvider>
            </body>
        </html>
    );
}
