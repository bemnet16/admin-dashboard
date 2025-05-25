import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import type React from "react";

export default function ScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <TopNav />
        <div className="container mx-auto p-6 max-w-7xl">
          <main className="w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
