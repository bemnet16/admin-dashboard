"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { ContentItem } from "@/types/content";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Eye,
  Flag,
  ImageIcon,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Video,
  XCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ContentListProps {
  contentItems: ContentItem[];
  viewMode: "table" | "cards";
  onViewContent: (content: ContentItem) => void;
  onContentAction: (contentId: string, action: string) => void;
}

export function ContentList({
  contentItems,
  viewMode,
  onViewContent,
  onContentAction,
}: ContentListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(contentItems.length / itemsPerPage);
  const paginatedItems = contentItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return (
          <Badge variant="destructive" className="gap-1 -ml-2">
            <AlertTriangle className="h-3 w-3" />
            Reported
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="gap-1 -ml-2">
            <Flag className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="success" className="gap-1 -ml-2">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="gap-1 -ml-2">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      case "video":
        return <Video className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "post":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-4">
      {viewMode === "table" ? (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead className="min-w-[200px]">Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Reports</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No content found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={item.user.avatar || "/placeholder.svg"}
                              alt={item.user.name}
                            />
                            <AvatarFallback>
                              {item.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{item.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {item.user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMediaIcon(item.mediaType)}
                          <span className="text-sm">
                            {truncateText(item.content, 50)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getContentTypeIcon(item.contentType)}
                          <span className="capitalize">{item.contentType}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(item.postedAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.reports}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={item.aiScore} className="h-2 w-16" />
                          <span className="text-sm font-medium">
                            {item.aiScore}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewContent(item)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  onContentAction(item.id, "approve")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onContentAction(item.id, "reject")
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2 text-amber-500" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onContentAction(item.id, "delete")
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedItems.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No content found matching your filters
            </div>
          ) : (
            paginatedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={item.user.avatar || "/placeholder.svg"}
                            alt={item.user.name}
                          />
                          <AvatarFallback>
                            {item.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {item.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(item.postedAt)}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getContentTypeIcon(item.contentType)}
                          <span className="capitalize">{item.contentType}</span>
                        </div>
                        {item.mediaType !== "text" && (
                          <div className="flex items-center gap-1">
                            {getMediaIcon(item.mediaType)}
                            <span className="capitalize">{item.mediaType}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm">
                        {truncateText(item.content, 100)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Reports: </span>
                        <Badge variant="outline" className="ml-1">
                          {item.reports}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reason: </span>
                        <span>{item.flaggedReason}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-muted-foreground">
                        AI Score:
                      </span>
                      <Progress value={item.aiScore} className="h-2 flex-1" />
                      <span className="text-xs font-medium">
                        {item.aiScore}%
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-2  border-t items-end  ">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => onViewContent(item)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View Full
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        Actions
                        <ChevronDown className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onContentAction(item.id, "approve")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onContentAction(item.id, "reject")}
                      >
                        <XCircle className="h-4 w-4 mr-2 text-amber-500" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onContentAction(item.id, "delete")}
                      >
                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {contentItems.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{paginatedItems.length}</span>{" "}
            of <span className="font-medium">{contentItems.length}</span> items
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
      )}
    </div>
  );
}
