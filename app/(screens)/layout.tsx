"use client";

import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import type React from "react";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export default function ScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {



  const session = useSession();

  if (session.status === "loading") {
    return null;
  }

  if (session.status === "unauthenticated") {
    redirect("/signin");
  }

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
