import "./globals.css";
import ReduxProvider from "@/store/reduxProvider";
import AuthProvider from "./api/auth/[...nextauth]/authProvider";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/settings-context";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ethio Social Media Admin Dashboard",
  description: "A modern, responsive financial dashboard",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body className={inter.className}>
          <ReduxProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SettingsProvider>
                <TooltipProvider delayDuration={0}>
                  <div>{children}</div>
                </TooltipProvider>
              </SettingsProvider>
            </ThemeProvider>
          </ReduxProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
