"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUp,
  Coins,
  DollarSign,
  Flame,
  Plus,
  RefreshCw,
} from "lucide-react";
import { UserTransactionsTab } from "@/components/token-management/user-transactions-tab";
import { MintBurnTab } from "@/components/token-management/mint-burn-tab";
import { TokenSaleTab } from "@/components/token-management/token-sale-tab";
import { mockTokenStats } from "@/lib/token-data";

export default function TokenManagementPage() {
  const [tokenStats, setTokenStats] = useState(mockTokenStats);

  // This would be replaced with actual API calls in a real implementation
  const refreshStats = () => {
    console.log("Refreshing token stats...");
    // Simulate API call with a slight delay
    setTimeout(() => {
      setTokenStats({
        ...tokenStats,
        lastUpdated: new Date().toISOString(),
      });
    }, 500);
  };

  return (
    <div className="mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Stars Token Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage token circulation, mint/burn operations, and sale settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(tokenStats.lastUpdated).toLocaleString()}
          </div>
          <button
            onClick={refreshStats}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            title="Refresh stats"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stars in Circulation
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tokenStats.circulation.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {tokenStats.circulationChange >= 0 ? "+" : ""}
              {tokenStats.circulationChange.toLocaleString()} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stars Minted
            </CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tokenStats.minted.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="h-3 w-3 mr-1" />
              {tokenStats.mintedChange.toLocaleString()} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stars Burned
            </CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tokenStats.burned.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-red-500">
              <ArrowUp className="h-3 w-3 mr-1" />
              {tokenStats.burnedChange.toLocaleString()} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Token Sale Price
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${tokenStats.price.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-green-500">
              <ArrowUp className="h-3 w-3 mr-1" />
              {tokenStats.priceChange > 0 ? "+" : ""}
              {tokenStats.priceChange.toFixed(2)}% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="transactions">User Transactions</TabsTrigger>
          <TabsTrigger value="mint-burn">Mint / Burn</TabsTrigger>
          <TabsTrigger value="sale-settings">Token Sale Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <UserTransactionsTab />
        </TabsContent>

        <TabsContent value="mint-burn" className="space-y-4">
          <MintBurnTab />
        </TabsContent>

        <TabsContent value="sale-settings" className="space-y-4">
          <TokenSaleTab
            currentPrice={tokenStats.price}
            saleActive={tokenStats.saleActive}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
