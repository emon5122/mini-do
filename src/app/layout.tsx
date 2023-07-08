import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";
import Provider from "./provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import { Heart } from "lucide-react";

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div>
            <div className="flex justify-between py-2 bg-accent items-center">
              <h1 className="text-center font-extrabold ml-10 text-xl">
                <Link href="/"> TODO APP </Link>
              </h1>
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
        <footer className="flex justify-center py-2 bg-accent mt-4">
          <p className="flex flex-row gap-2">
            Made with {<Heart className="text-destructive fill-destructive" />}
            by
            <Link href={"https://ihemon.me"}>
              <span className="hover:text-primary/40 transition-all duration-300 ease-in-out">
                Istiak Hassan Emon
              </span>
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
