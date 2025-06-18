"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Copy, Gift, ShoppingCart, Wallet, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "@/lib/contract-config";

interface BalanceTabProps {
  userData: {
    tokenBalance: number;
    walletId?: string;
  };
  transactionData: Array<{
    id: string;
    txHash: string;
    amount: string;
    type: string;
    date: string;
  }>;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  type: "mint" | "burn" | "transfer";
}

export function BalanceTab({ userData, transactionData: initialTransactionData }: BalanceTabProps) {
  const [realBalance, setRealBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData.walletId) return;
      
      try {
        setIsLoading(true);
        const provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.RPC_URL);
        const tokenContract = new ethers.Contract(
          CONTRACT_CONFIG.STARS_TOKEN_ADDRESS,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );
        
        const balance = await tokenContract.balanceOf(userData.walletId);
        setRealBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error fetching token balance:", error);
        toast({
          title: "Error",
          description: "Failed to fetch token balance",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userData.walletId]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userData.walletId) return;

      try {
        setIsLoadingTransactions(true);
        const response = await fetch(
          `${CONTRACT_CONFIG.ETHERSCAN_API_URL}?module=account&action=tokentx&contractaddress=${CONTRACT_CONFIG.STARS_TOKEN_ADDRESS}&address=${userData.walletId}&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=${CONTRACT_CONFIG.ETHERSCAN_API_KEY}`
        );

        const data = await response.json();

        if (data.status === "1" && data.result) {
          const formattedTransactions = data.result.map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            timeStamp: tx.timeStamp,
            type: tx.from.toLowerCase() === userData.walletId?.toLowerCase() ? "spent" : "received"
          }));
          setTransactions(formattedTransactions);
        } else {
          throw new Error(data.message || "Failed to fetch transactions");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast({
          title: "Error",
          description: "Failed to fetch transaction history",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [userData.walletId]);

  const getTransactionType = (tx: any): "mint" | "burn" | "transfer" => {
    if (tx.to.toLowerCase() === CONTRACT_CONFIG.STARS_TOKEN_ADDRESS.toLowerCase()) {
      return "mint";
    } else if (tx.from.toLowerCase() === CONTRACT_CONFIG.STARS_TOKEN_ADDRESS.toLowerCase()) {
      return "burn";
    } else {
      return "transfer";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
  };

  const formatAmount = (value: string) => {
    return ethers.formatEther(value);
  };

  const calculateTransactionTotals = () => {
    let received = 0;
    let spent = 0;

    transactions.forEach((tx) => {
      const amount = Number(formatAmount(tx.value));
      if (tx.type === "received") {
        received += amount;
      } else if (tx.type === "spent") {
        spent += amount;
      }
    });

    return { received, spent };
  };

  const { received, spent } = calculateTransactionTotals();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Stars Token Balance</CardTitle>
          <CardDescription>
            {userData.walletId ? "Current token balance and statistics" : "No wallet connected"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!userData.walletId ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Wallet className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-center">
                No wallet connected
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {isLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    ) : (
                      Number(realBalance).toFixed(2) || "0"
                    )}
                  </div>
                  <div className="text-muted-foreground">Stars Tokens</div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{received.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Received</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{spent.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Spent</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {userData.walletId ? "Last 10 token transactions" : "No wallet connected"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!userData.walletId ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Wallet className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-center">
                No wallet connected
              </p>
            </div>
          ) : isLoadingTransactions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tx Hash</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.slice(0, 10).map((tx) => (
                      <TableRow key={tx.hash}>
                        <TableCell className="font-mono text-xs">
                          <div className="flex items-center gap-1">
                            {truncateHash(tx.hash)}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(tx.hash)}
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">Copy transaction hash</span>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{formatAmount(tx.value)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {tx.type === "received" ? (
                              <Gift className="h-3 w-3 text-green-500" />
                            ) : (
                              <ShoppingCart className="h-3 w-3 text-red-500" />
                            )}
                            <span className="capitalize">{tx.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(tx.timeStamp)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
