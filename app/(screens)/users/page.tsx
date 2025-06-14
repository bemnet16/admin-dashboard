"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { format, addDays, subDays } from "date-fns";
import { DateRange as DateRangeType } from "react-day-picker";

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
  Filter,
  ArrowUpDown,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { useGetUsersQuery } from "@/store/services/userApi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function UsersPage() {
  const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [dateRange, setDateRange] = useState<DateRangeType | undefined>(undefined);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Fetch users data using RTK Query
  const { data: users, isLoading, error } = useGetUsersQuery(session?.user.accessToken);

  // Filter users based on all criteria
  const filteredUsers = users?.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === "All" || 
      (statusFilter === "Active" && user.role !== "Suspended") ||
      (statusFilter === "Suspended" && user.role === "Suspended");

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    const matchesDateRange = !dateRange?.from || !dateRange?.to || 
      (new Date(user.createdAt) >= dateRange.from && 
       new Date(user.createdAt) <= dateRange.to);

    return matchesSearch && matchesStatus && matchesRole && matchesDateRange;
  }) || [];

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    switch (sortBy) {
      case "name":
        return order * (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`);
      case "email":
        return order * a.email.localeCompare(b.email);
      case "role":
        return order * a.role.localeCompare(b.role);
      case "date":
        return order * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const clearDateRange = () => {
    setDateRange(undefined);
  };

  const dateOptions = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
    { label: "This month", getDate: () => {
      const today = new Date();
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: today,
      };
    }},
    { label: "Last month", getDate: () => {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return {
        from: lastMonth,
        to: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    }},
  ];

  const setQuickDateRange = (option: typeof dateOptions[0]) => {
    const range = option.getDate ? option.getDate() : {
      from: subDays(new Date(), option.days),
      to: new Date(),
    };
    setDateRange(range);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading users. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={roleFilter} 
                  onValueChange={setRoleFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !dateRange?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM dd")} -{" "}
                            {format(dateRange.to, "MMM dd")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM dd")
                        )
                      ) : (
                        <span>Select time period</span>
                      )}
                      {dateRange?.from && (
                        <X
                          className="ml-auto h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDateRange(undefined);
                          }}
                        />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Time Period</h4>
                        {dateRange?.from && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDateRange(undefined)}
                            className="h-7 px-2 text-xs"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        {dateOptions.map((option) => (
                          <Button
                            key={option.label}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 justify-start text-sm",
                              dateRange?.from && dateRange?.to && (
                                option.getDate ? 
                                  format(option.getDate().from, "yyyy-MM-dd") === format(dateRange.from, "yyyy-MM-dd") :
                                  option.days === Math.ceil((new Date().getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
                              ) && "bg-muted"
                            )}
                            onClick={() => setQuickDateRange(option)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="15">15 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table Section */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="flex items-center"
                      >
                        User
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("role")}
                        className="flex items-center"
                      >
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Social</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("date")}
                        className="flex items-center"
                      >
                        Joined Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? (
                          <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8" />
                            <p>No users found matching "{searchQuery}"</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ShieldAlert className="h-8 w-8" />
                            <p>No users available</p>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={user.profilePic}
                                alt={`${user.firstName} ${user.lastName}`}
                              />
                              <AvatarFallback>
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{`${user.firstName} ${user.lastName}`}</span>
                              <span className="text-sm text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "Admin"
                                ? "default"
                                : user.role === "Moderator"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "Suspended"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {user.role === "Suspended" ? "Suspended" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Followers:</span>
                              <span className="font-medium">{user.followers?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Following:</span>
                              <span className="font-medium">{user.following?.length || 0}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                        <Link
                                  href={`/users/${user.id}`}
                                  className="flex  items-center justify-center"
                                >
                                  <EyeIcon className=" h-4 w-4" />
                                </Link>

                          {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link
                                  href={`/users/${user.id}`}
                                  className="flex items-center"
                                >
                                  <EyeIcon className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  href={`/token-management/${user.id}`}
                                  className="flex items-center"
                                >
                                  <KeyRound className="mr-2 h-4 w-4" />
                                  Manage Tokens
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  href={`/content-management/${user.id}`}
                                  className="flex items-center"
                                >
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  Manage Content
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu> */}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Section */}
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
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
