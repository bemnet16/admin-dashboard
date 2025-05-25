"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EyeIcon,
  KeyRound,
  MoreHorizontal,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

// Mock data for users
const users = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    walletAddress: "0x1a2b3c4d5e6f7g8h9i0j",
    role: "Admin",
    status: "Active",
    verified: true,
    tokenBalance: 1250,
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    walletAddress: "0x2b3c4d5e6f7g8h9i0j1k",
    role: "User",
    status: "Active",
    verified: true,
    tokenBalance: 450,
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    walletAddress: "0x3c4d5e6f7g8h9i0j1k2l",
    role: "User",
    status: "Suspended",
    verified: false,
    tokenBalance: 0,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    walletAddress: "0x4d5e6f7g8h9i0j1k2l3m",
    role: "Moderator",
    status: "Active",
    verified: true,
    tokenBalance: 780,
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    walletAddress: "0x5e6f7g8h9i0j1k2l3m4n",
    role: "User",
    status: "Active",
    verified: false,
    tokenBalance: 120,
  },
  {
    id: "6",
    name: "Jessica Taylor",
    email: "jessica@example.com",
    walletAddress: "0x6f7g8h9i0j1k2l3m4n5o",
    role: "User",
    status: "Suspended",
    verified: true,
    tokenBalance: 350,
  },
  {
    id: "7",
    name: "Alex Johnson",
    email: "alex@example.com",
    walletAddress: "0x1a2b3c4d5e6f7g8h9i0j",
    role: "Admin",
    status: "Active",
    verified: true,
    tokenBalance: 1250,
  },
  {
    id: "8",
    name: "Sarah Williams",
    email: "sarah@example.com",
    walletAddress: "0x2b3c4d5e6f7g8h9i0j1k",
    role: "User",
    status: "Active",
    verified: true,
    tokenBalance: 450,
  },
  {
    id: "9",
    name: "Michael Brown",
    email: "michael@example.com",
    walletAddress: "0x3c4d5e6f7g8h9i0j1k2l",
    role: "User",
    status: "Suspended",
    verified: false,
    tokenBalance: 0,
  },
  {
    id: "10",
    name: "Emily Davis",
    email: "emily@example.com",
    walletAddress: "0x4d5e6f7g8h9i0j1k2l3m",
    role: "Moderator",
    status: "Active",
    verified: true,
    tokenBalance: 780,
  },
  {
    id: "11",
    name: "David Wilson",
    email: "david@example.com",
    walletAddress: "0x5e6f7g8h9i0j1k2l3m4n",
    role: "User",
    status: "Active",
    verified: false,
    tokenBalance: 120,
  },
  {
    id: "12",
    name: "Jessica Taylor",
    email: "jessica@example.com",
    walletAddress: "0x6f7g8h9i0j1k2l3m4n5o",
    role: "User",
    status: "Suspended",
    verified: true,
    tokenBalance: 350,
  },
  {
    id: "13",
    name: "Alex Johnson",
    email: "alex@example.com",
    walletAddress: "0x1a2b3c4d5e6f7g8h9i0j",
    role: "Admin",
    status: "Active",
    verified: true,
    tokenBalance: 1250,
  },
  {
    id: "14",
    name: "Sarah Williams",
    email: "sarah@example.com",
    walletAddress: "0x2b3c4d5e6f7g8h9i0j1k",
    role: "User",
    status: "Active",
    verified: true,
    tokenBalance: 450,
  },
  {
    id: "15",
    name: "Michael Brown",
    email: "michael@example.com",
    walletAddress: "0x3c4d5e6f7g8h9i0j1k2l",
    role: "User",
    status: "Suspended",
    verified: false,
    tokenBalance: 0,
  },
  {
    id: "16",
    name: "Emily Davis",
    email: "emily@example.com",
    walletAddress: "0x4d5e6f7g8h9i0j1k2l3m",
    role: "Moderator",
    status: "Active",
    verified: true,
    tokenBalance: 780,
  },
  {
    id: "17",
    name: "David Wilson",
    email: "david@example.com",
    walletAddress: "0x5e6f7g8h9i0j1k2l3m4n",
    role: "User",
    status: "Active",
    verified: false,
    tokenBalance: 120,
  },
  {
    id: "18",
    name: "Jessica Taylor",
    email: "jessica@example.com",
    walletAddress: "0x6f7g8h9i0j1k2l3m4n5o",
    role: "User",
    status: "Suspended",
    verified: true,
    tokenBalance: 350,
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter users based on search query and status filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.walletAddress.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "All") return matchesSearch;
    if (statusFilter === "Active")
      return matchesSearch && user.status === "Active";
    if (statusFilter === "Suspended")
      return matchesSearch && user.status === "Suspended";
    if (statusFilter === "Verified") return matchesSearch && user.verified;

    return matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight"> Manage Users</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="w-full sm:w-[250px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>{" "}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 px-6">
          {/* <CardTitle className="text-2xl font-bold">Users</CardTitle> */}
          {/* <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full sm:w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div> */}
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={statusFilter === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("All")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "Active" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Active")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "Suspended" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Suspended")}
            >
              Suspended
            </Button>
            <Button
              variant={statusFilter === "Verified" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("Verified")}
            >
              Verified
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Wallet Address
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Token Balance
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">
                        {user.walletAddress.substring(0, 6)}...
                        {user.walletAddress.substring(
                          user.walletAddress.length - 4
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.role}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "Active" ? "success" : "destructive"
                          }
                          className="capitalize"
                        >
                          {user.status}
                        </Badge>
                        {user.verified && (
                          <Badge variant="outline" className="ml-1">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.tokenBalance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link
                                href={`/users/${user.id}`}
                                className="flex items-center"
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {user.status === "Active" ? (
                                <>
                                  <ShieldAlert className="h-4 w-4 mr-2" />
                                  Suspend User
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Activate User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {!user.verified ? (
                                <>
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Verify User
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="h-4 w-4 mr-2" />
                                  Unverify User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <KeyRound className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium">{paginatedUsers.length}</span> of{" "}
                <span className="font-medium">{filteredUsers.length}</span>{" "}
                users
              </p>
              <div className="flex items-center space-x-2  pl-6">
                <p className="text-sm text-muted-foreground">Rows per page</p>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
