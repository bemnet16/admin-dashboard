"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

// Import our custom components
import { UserInfoCard } from "@/components/users/user-info-card";
import { ContentTab } from "@/components/users/content-tab";
import { BalanceTab } from "@/components/users/balance-tab";
import { ActionsTab } from "@/components/users/actions-tab";

// Import mock data
import { userData, contentData, transactionData } from "@/lib/mock-data";

export default function UserProfilePage() {
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6 flex items-center">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <Link href="/users" className="ml-auto">
          <Button variant="outline" size="sm" className="ml-auto">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>

      {/* User Information Card */}
      <UserInfoCard user={userData} />

      {/* Tabs */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="balance">Balance & Transactions</TabsTrigger>
          <TabsTrigger value="actions">Admin Actions</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <ContentTab contentData={contentData} />
        </TabsContent>

        {/* Balance & Transactions Tab */}
        <TabsContent value="balance" className="space-y-4">
          <BalanceTab userData={userData} transactionData={transactionData} />
        </TabsContent>

        {/* Admin Actions Tab */}
        <TabsContent value="actions">
          <ActionsTab userData={userData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
