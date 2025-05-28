"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentList } from "@/components/content-management/list";
import { ContentDrawer } from "@/components/content-management/drawer";
import type { ContentItem, ViewMode } from "@/types/content";
import { Filter, Search, X } from "lucide-react";
import { useGetContentsQuery } from "@/store/services/contentApi";

export default function ContentManagementPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);

  // Fetch content data using RTK Query
  const { data: contentResponse, isLoading, error } = useGetContentsQuery({
    page: currentPage,
    limit: itemsPerPage,
    token: session?.user.accessToken
  });

  // Filter content based on selected filters and search query
  const filteredContent = contentResponse?.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.profile.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesContentType =
      contentTypeFilter === "all" || item.contentType === contentTypeFilter;

    const matchesMediaType =
      mediaTypeFilter === "all" || item.mediaType === mediaTypeFilter;

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return (
      matchesSearch && matchesContentType && matchesMediaType && matchesStatus
    );
  }) || [];

  const handleViewContent = (content: ContentItem) => {
    setSelectedContent(content);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`Action ${action} on content ${contentId}`);
    // In a real app, you would update the content status here
    // and potentially close the drawer if the action was taken from there
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setContentTypeFilter("all");
    setMediaTypeFilter("all");
    setStatusFilter("all");
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
        <div className="text-red-500">Error loading content. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Contents</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Tabs
            defaultValue="table"
            value={viewMode}
            onValueChange={(value) => setViewMode(value as ViewMode)}
            className="hidden sm:block"
          >
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Filter Section */}
      <Card className={`${showFilters ? "block" : "hidden sm:block"}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search content or users..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Select
                value={contentTypeFilter}
                onValueChange={setContentTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="post">Posts</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={mediaTypeFilter}
                onValueChange={setMediaTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Media Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Media</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-9"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <ContentList
        contentItems={filteredContent}
        viewMode={viewMode}
        onViewContent={handleViewContent}
        onContentAction={handleContentAction}
      />

      {/* Content Drawer */}
      <ContentDrawer
        content={selectedContent}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onContentAction={handleContentAction}
      />
    </div>
  );
}
