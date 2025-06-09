"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUp,
  Coins,
  DollarSign,
  Flame,
  Plus,
  RefreshCw,
  ExternalLink,
  Wallet,
} from "lucide-react";
import { UserTransactionsTab } from "@/components/token-management/user-transactions-tab";
import { MintBurnTab } from "@/components/token-management/mint-burn-tab";
import { TokenSaleTab } from "@/components/token-management/token-sale-tab";
import { mockTokenStats, fetchTokenStats, TokenStats } from "@/lib/token-data";
import { CONTRACT_CONFIG, getContractUrl } from "@/lib/contract-config";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/wallet-context";

export default function TokenManagementPage() {
  const [tokenStats, setTokenStats] = useState<TokenStats>(mockTokenStats);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected, isConnecting, connect } = useWallet();

  const refreshStats = async () => {
    try {
      setIsLoading(true);
      const stats = await fetchTokenStats();
      setTokenStats(stats);
    } catch (error) {
      console.error("Error refreshing stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

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
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              asChild
            >
              <a
                href={getContractUrl(CONTRACT_CONFIG.STARS_TOKEN_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Token Contract
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              asChild
            >
              <a
                href={getContractUrl(CONTRACT_CONFIG.STARS_PLATFORM_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Platform Contract
              </a>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
         
        <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                </span>
              </div>
            ) : (
              <Button
                onClick={connect}
                disabled={isConnecting}
                size="sm"
              >
                {isConnecting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
          </div>
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
              {isLoading ? (
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              ) : (
                tokenStats.circulation.toLocaleString()
              )}
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
              {isLoading ? (
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              ) : (
                tokenStats.minted.toLocaleString()
              )}
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
              {isLoading ? (
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              ) : (
                tokenStats.burned.toLocaleString()
              )}
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
              {isLoading ? (
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              ) : (
                `$${tokenStats.price.toFixed(2)}`
              )}
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
