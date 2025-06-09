"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { mockTransactions } from "@/lib/token-data";
import {
  Copy,
  ExternalLink,
  Flame,
  Gift,
  Search,
  ShoppingCart,
  Sparkles,
  Plus,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CONTRACT_CONFIG, getEtherscanUrl } from "@/lib/contract-config";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError: string;
}

export function UserTransactionsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${CONTRACT_CONFIG.ETHERSCAN_API_URL}?module=account&action=txlist&address=${CONTRACT_CONFIG.STARS_PLATFORM_ADDRESS}&startblock=0&endblock=99999999&sort=desc&apikey=${CONTRACT_CONFIG.ETHERSCAN_API_KEY}`
      );

      const data = await response.json();

      if (data.status === "1" && data.result) {
        setTransactions(data.result);
      } else {
        throw new Error(data.message || "Failed to fetch transactions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionType = (tx: Transaction) => {
    if (tx.to.toLowerCase() === CONTRACT_CONFIG.STARS_TOKEN_ADDRESS.toLowerCase()) {
      return "mint";
    } else if (tx.from.toLowerCase() === CONTRACT_CONFIG.STARS_TOKEN_ADDRESS.toLowerCase()) {
      return "burn";
    } else {
      return "transfer";
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "mint":
        return <Plus className="h-4 w-4 text-green-500" />;
      case "burn":
        return <Flame className="h-4 w-4 text-red-500" />;
      case "transfer":
        return <Gift className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredTransactions = transactions.filter((tx) => {
    const type = getTransactionType(tx);
    const matchesSearch = 
      tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Transactions</CardTitle>
        <CardDescription>
          View and search all token transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by wallet address..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="mint">Mint</SelectItem>
              <SelectItem value="burn">Burn</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((tx) => {
                  const type = getTransactionType(tx);
                  const amount = parseFloat(tx.value) / 1e18; // Convert from wei to ETH
                  const date = new Date(parseInt(tx.timeStamp) * 1000).toLocaleString();

                  return (
                    <TableRow key={tx.hash}>
                    <TableCell>
                        <div className="flex items-center gap-1">
                          {getTransactionTypeIcon(type)}
                          <span className="capitalize">{type}</span>
                          </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-sm">
                            {truncateAddress(tx.from)}
                            </span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                  onClick={() => copyToClipboard(tx.from)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  <span className="sr-only">Copy address</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy wallet address</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                          <span className="font-mono text-sm">
                            {truncateAddress(tx.to)}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                  onClick={() => copyToClipboard(tx.to)}
                              >
                                <Copy className="h-3 w-3" />
                                  <span className="sr-only">Copy address</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Copy wallet address</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {amount.toLocaleString()} STARS
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {date}
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                asChild
                              >
                                <a
                                  href={getEtherscanUrl(tx.hash)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span className="sr-only">
                                    View on block explorer
                                  </span>
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View on block explorer</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">{paginatedTransactions.length}</span>{" "}
            of{" "}
            <span className="font-medium">{filteredTransactions.length}</span>{" "}
            transactions
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                // Show first page, last page, current page, and pages around current page
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Show ellipsis for gaps
                if (page === 2 || page === totalPages - 1) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
