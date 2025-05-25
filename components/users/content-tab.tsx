"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowUpRight,
  ExternalLink,
  Filter,
  Heart,
  MessageSquare,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { MediaGallery } from "./media-gallery";

interface ContentTabProps {
  contentData: any[];
}

export function ContentTab({ contentData }: ContentTabProps) {
  const [contentPage, setContentPage] = useState(1);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const itemsPerPage = 5;

  // Handle expanding/collapsing content
  const handleExpandContent = (contentId: string) => {
    // If we're expanding a different content than what's currently expanded
    if (expandedContent !== contentId) {
      // Find all video elements and pause them
      const videos = document.querySelectorAll("video");
      videos.forEach((video) => {
        video.pause();
      });
    }

    // Toggle the expanded state
    setExpandedContent(expandedContent === contentId ? null : contentId);
  };

  // Apply filters to content data
  const filteredContent = contentData.filter((item) => {
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const totalContentPages = Math.ceil(filteredContent.length / itemsPerPage);
  const paginatedContent = filteredContent.slice(
    (contentPage - 1) * itemsPerPage,
    contentPage * itemsPerPage
  );

  // Reset to first page when filters change
  const handleFilterChange = (type: string, status: string) => {
    setTypeFilter(type);
    setStatusFilter(status);
    setContentPage(1);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const time = new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} at ${time}`;
  };

  // Add this useEffect to handle pausing videos when content is collapsed
  useEffect(() => {
    // Find all video elements and pause them when content is collapsed
    if (expandedContent === null) {
      const videos = document.querySelectorAll("video");
      videos.forEach((video) => {
        video.pause();
      });
    }
  }, [expandedContent]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Content</CardTitle>
        <CardDescription>
          View and manage this user's posts and comments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Content Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          {/* Content Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Type: {typeFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Content Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("All", statusFilter)}
                  className={typeFilter === "All" ? "bg-muted" : ""}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("Post", statusFilter)}
                  className={typeFilter === "Post" ? "bg-muted" : ""}
                >
                  Posts
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("Comment", statusFilter)}
                  className={typeFilter === "Comment" ? "bg-muted" : ""}
                >
                  Comments
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Status: {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Content Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleFilterChange(typeFilter, "All")}
                  className={statusFilter === "All" ? "bg-muted" : ""}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange(typeFilter, "Approved")}
                  className={statusFilter === "Approved" ? "bg-muted" : ""}
                >
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange(typeFilter, "Reported")}
                  className={statusFilter === "Reported" ? "bg-muted" : ""}
                >
                  Reported
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange(typeFilter, "Deleted")}
                  className={statusFilter === "Deleted" ? "bg-muted" : ""}
                >
                  Deleted
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Reset Filters */}
          {(typeFilter !== "All" || statusFilter !== "All") && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground"
              onClick={() => handleFilterChange("All", "All")}
            >
              Reset filters
            </Button>
          )}

          {/* Results count */}
          <div className="ml-auto text-sm text-muted-foreground">
            {filteredContent.length}{" "}
            {filteredContent.length === 1 ? "item" : "items"}
          </div>
        </div>

        <div className="space-y-6">
          {paginatedContent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No content found
            </div>
          ) : (
            paginatedContent.map((item) => (
              <ContentItem
                key={item.id}
                item={item}
                isExpanded={expandedContent === item.id}
                onToggleExpand={() => handleExpandContent(item.id)}
                formatDateTime={formatDateTime}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredContent.length > itemsPerPage && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setContentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      contentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalContentPages }).map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalContentPages ||
                    (page >= contentPage - 1 && page <= contentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setContentPage(page)}
                          isActive={page === contentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (page === 2 || page === totalContentPages - 1) {
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
                      setContentPage((prev) =>
                        Math.min(prev + 1, totalContentPages)
                      )
                    }
                    className={
                      contentPage === totalContentPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Content Item Component
function ContentItem({
  item,
  isExpanded,
  onToggleExpand,
  formatDateTime,
}: {
  item: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  formatDateTime: (date: string) => string;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all",
        item.status === "Reported" && "border-amber-500",
        isExpanded ? "shadow-md" : ""
      )}
    >
      <CardHeader className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            {item.type === "Post" ? (
              <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded">
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded">
                <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
            )}
            <span className="font-medium">{item.type}</span>
          </div>

          <Badge
            variant={
              item.status === "Approved"
                ? "outline"
                : item.status === "Reported"
                ? "warning"
                : "destructive"
            }
            className="capitalize"
          >
            {item.status}
          </Badge>

          <div className="text-sm text-muted-foreground ml-auto">
            {formatDateTime(item.date)}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="ml-auto sm:ml-0"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </CardHeader>

      <div
        className={cn(
          "grid transition-all overflow-hidden",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <CardContent className="p-0">
            {/* Content preview based on type */}
            <div className="p-4 pt-0">
              {item.contentType !== "text" && item.mediaItems && (
                <MediaGallery mediaItems={item.mediaItems} postId={item.id} />
              )}

              <div className="text-sm">{item.preview}</div>

              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {item.likes} likes
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  {item.shares} shares
                </div>
              </div>
            </div>
          </CardContent>

          <Separator />

          <div className="p-4 flex flex-wrap gap-2">
            {item.status !== "Approved" && (
              <Button size="sm" variant="outline" className="gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Approve
              </Button>
            )}

            {item.status !== "Deleted" && (
              <Button size="sm" variant="outline" className="gap-2">
                <Trash2 className="h-4 w-4 text-red-500" />
                Delete
              </Button>
            )}

            <Button size="sm" variant="outline" className="gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Flag as Inappropriate
            </Button>

            <Button size="sm" variant="outline" className="gap-2 ml-auto">
              <ExternalLink className="h-4 w-4" />
              View Full Post
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
