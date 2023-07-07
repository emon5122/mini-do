import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";
import Provider from "./provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
    title: "Todo App",
    description: "Experimental Todo App",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <div className="flex flex-col">
                        <div className="flex justify-end mt-2 mb-4">
                            <ModeToggle />
                        </div>
                        <main>
                            <Provider>
                                <TooltipProvider>{children}</TooltipProvider>
                            </Provider>
                        </main>
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
