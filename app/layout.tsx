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
import { WalletProvider } from "@/lib/wallet-context";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stars Token Management",
  description: "Manage your Stars token operations",
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
                  <WalletProvider>
                    <div>{children}</div>
                  </WalletProvider>
                </TooltipProvider>
              </SettingsProvider>
            </ThemeProvider>
          </ReduxProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
