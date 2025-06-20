"use client";

import { useState, useEffect } from "react";
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
import { TableView } from "@/components/content-management/table-view";
import { CardView as ContentCardView } from "@/components/content-management/card-view";
import { ContentDrawer } from "@/components/content-management/drawer";
import type { ContentItem, ViewMode } from "@/types/content";
import { Filter, Search, X } from "lucide-react";
import { useGetContentsQuery } from "@/store/services/contentApi";
import { PostsTable } from "@/components/posts-management/table";
import { PostsDrawer } from "@/components/posts-management/drawer";
import { PostsPagination } from "@/components/posts-management/pagination";
import { ContentPagination } from "@/components/content-management/pagination";
import { CardView } from "@/components/posts-management/card-view";
import type { Post } from "@/types/post";
import { useGetPostsQuery, useApprovePostMutation, useRejectPostMutation, useDeletePostMutation } from "@/store/services/postsApi";
import { useToast } from "@/components/ui/use-toast";
import { Grid, List } from "lucide-react";
import { useDeleteContentMutation } from "@/store/services/contentApi";
import { Checkbox } from "@/components/ui/checkbox";

const ITEMS_PER_PAGE = 9;

export default function ContentManagementPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"reels" | "posts">("reels");
  const [searchQuery, setSearchQuery] = useState("");
  const [labelFilter, setLabelFilter] = useState("all");
  const [aiScoreFilter, setAiScoreFilter] = useState("all");
  const [showReportedOnly, setShowReportedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [reelsPage, setReelsPage] = useState(1);
  const [postsPage, setPostsPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItemsSeen, setTotalItemsSeen] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Posts state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isDeletingContent, setIsDeletingContent] = useState(false);
  const { toast } = useToast();

  // Fetch content data using RTK Query
  const { data: contentResponse, isLoading: isLoadingContent, error: contentError } = useGetContentsQuery({
    page: reelsPage,
    limit: itemsPerPage,
    token: session?.user.accessToken
  });

  // Update total items seen when new data arrives
  useEffect(() => {
    if (contentResponse) {
      if (reelsPage === 1) {
        // Reset total when we're on page 1
        setTotalItemsSeen(contentResponse.length);
        setLastPage(1);
      } else if (reelsPage > lastPage) {
        // Only add to total when we're going forward
        setTotalItemsSeen(prev => prev + contentResponse.length);
        setLastPage(reelsPage);
      }
    }
  }, [contentResponse, reelsPage, lastPage]);

  // Fetch posts data
  const { data: postsData, isLoading: isLoadingPosts, refetch: refetchPosts } = useGetPostsQuery(
    { 
      token: session?.user.accessToken,
      page: postsPage,
      limit: ITEMS_PER_PAGE,
    },
    { skip: !session?.user.accessToken }
  );
  const [approvePost] = useApprovePostMutation();
  const [rejectPost] = useRejectPostMutation();
  const [deletePost] = useDeletePostMutation();
  const [deleteContent] = useDeleteContentMutation();

  // Filter content based on selected filters and search query
  const filteredContent = contentResponse?.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.profile.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLabel =
      labelFilter === "all" || item.label === labelFilter;

    const matchesAiScore = (() => {
      if (aiScoreFilter === "all") return true;
      const score = item.score || 0;
      switch (aiScoreFilter) {
        case "low":
          return score < 0.5;
        case "medium":
          return score >= 0.5 && score <= 0.8;
        case "high":
          return score > 0.8;
        default:
          return true;
      }
    })();

    const matchesReported = !showReportedOnly || (item.reportCount && item.reportCount > 0);

    return matchesSearch && matchesLabel && matchesAiScore && matchesReported;
  }) || [];

  // Filter posts
  const filteredPosts = postsData?.data?.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      (post.content?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      post.owner.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.owner.lastName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  }) || [];

  const handleViewContent = (content: ContentItem) => {
    setSelectedContent(content);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleContentAction = async (contentId: string, action: string) => {
    if (!session?.user.accessToken) return;

    try {
      if (action === "delete") {
        setIsDeletingContent(true);
        await deleteContent({ id: contentId, token: session.user.accessToken }).unwrap();
        toast({
          title: "Content deleted",
          description: "The content has been deleted successfully.",
        });
        if (isDrawerOpen) {
          setIsDrawerOpen(false);
        }
      } else {
        console.log(`Action ${action} on content ${contentId}`);
        if (isDrawerOpen) {
          setIsDrawerOpen(false);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the content.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingContent(false);
    }
  };

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
  };

  const handlePostAction = async (postId: string, action: string) => {
    if (!session?.user.accessToken) return;

    try {
      if (action === "approve") {
        await approvePost({ postId, token: session.user.accessToken }).unwrap();
        toast({
          title: "Post approved",
          description: "The post has been approved successfully.",
        });
      } else if (action === "reject") {
        await rejectPost({ postId, token: session.user.accessToken }).unwrap();
        toast({
          title: "Post rejected",
          description: "The post has been rejected successfully.",
        });
      } else if (action === "delete") {
        setIsDeletingPost(true);
        await deletePost({ postId, token: session.user.accessToken }).unwrap();
        toast({
          title: "Post deleted",
          description: "The post has been deleted successfully.",
        });
      }
      setSelectedPost(null);
      refetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the post.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingPost(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLabelFilter("all");
    setAiScoreFilter("all");
    setShowReportedOnly(false);
  };

  if (isLoadingContent || isLoadingPosts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (contentError) {
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
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
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

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "reels" | "posts")}>
        <TabsList>
          <TabsTrigger value="reels">Reels</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
      </Tabs>

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
              {activeTab === "reels" && (
                <>
                 <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reported"
                      checked={showReportedOnly}
                      onCheckedChange={(checked) => setShowReportedOnly(checked as boolean)}
                    />
                    <label
                      htmlFor="reported"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Reported Only
                    </label>
                  </div>
                  <Select
                    value={labelFilter}
                    onValueChange={setLabelFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Labels</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="hate">Hate</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={aiScoreFilter}
                    onValueChange={setAiScoreFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="AI Score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Scores</SelectItem>
                      <SelectItem value="low">{"< 50%"}</SelectItem>
                      <SelectItem value="medium">50% - 80%</SelectItem>
                      <SelectItem value="high">{"> 80%"}</SelectItem>
                    </SelectContent>
                  </Select>

                 
                </>
              )}
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
      {activeTab === "reels" ? (
        <>
          <div className="space-y-4">
            {viewMode === "table" ? (
              <TableView
                contentItems={filteredContent}
                onViewContent={handleViewContent}
                onContentAction={handleContentAction}
                isDeleting={isDeletingContent}
              />
            ) : (
              <ContentCardView
                contentItems={filteredContent}
                onViewContent={handleViewContent}
                onContentAction={handleContentAction}
                isDeleting={isDeletingContent}
              />
            )}
          </div>
          {contentResponse && (
            <ContentPagination
              currentPage={reelsPage}
              totalPages={Math.ceil(totalItemsSeen / itemsPerPage)}
              totalItems={totalItemsSeen}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => {
                setReelsPage(page);
                // The API call will automatically happen because reelsPage is a dependency
              }}
              hasNextPage={contentResponse.length === itemsPerPage}
            />
          )}
        </>
      ) : (
        <>
          {viewMode === "cards" ? (
            <CardView
              posts={filteredPosts}
              onViewPost={handleViewPost}
              onPostAction={handlePostAction}
              isDeleting={isDeletingPost}
            />
          ) : (
            <PostsTable
              posts={filteredPosts}
              onViewPost={handleViewPost}
              onPostAction={handlePostAction}
              isDeleting={isDeletingPost}
            />
          )}
          {postsData && (
            <PostsPagination
              currentPage={postsPage}
              totalPages={Math.ceil((postsData.total || 0) / ITEMS_PER_PAGE)}
              totalItems={postsData.total}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPostsPage}
            />
          )}
        </>
      )}

      {/* Content Drawer */}
      {activeTab === "reels" ? (
        <ContentDrawer
          content={selectedContent}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          onContentAction={handleContentAction}
          isDeleting={isDeletingContent}
        />
      ) : (
        <PostsDrawer
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          onPostAction={handlePostAction}
          isDeleting={isDeletingPost}
        />
      )}
    </div>
  );
}
