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
import { Copy, Gift, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BalanceTabProps {
  userData: {
    tokenBalance: number;
  };
  transactionData: Array<{
    id: string;
    txHash: string;
    amount: string;
    type: string;
    date: string;
  }>;
}

export function BalanceTab({ userData, transactionData }: BalanceTabProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Stars Token Balance</CardTitle>
          <CardDescription>
            Current token balance and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                {userData.tokenBalance}
              </div>
              <div className="text-muted-foreground">Stars Tokens</div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">350</div>
              <div className="text-sm text-muted-foreground">Received</div>
            </div>
            <div>
              <div className="text-2xl font-bold">125</div>
              <div className="text-sm text-muted-foreground">Spent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Last 10 token transactions</CardDescription>
        </CardHeader>
        <CardContent>
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
                {transactionData.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-1">
                        {truncateHash(tx.txHash)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(tx.txHash)}
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy transaction hash</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {tx.type === "gift" ? (
                          <Gift className="h-3 w-3 text-green-500" />
                        ) : (
                          <ShoppingCart className="h-3 w-3 text-blue-500" />
                        )}
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDate(tx.date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
