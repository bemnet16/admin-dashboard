"use client";

import { useState, useMemo } from "react";
import { PostsTable } from "@/components/posts-management/table";
import { PostsDrawer } from "@/components/posts-management/drawer";
import { PostsPagination } from "@/components/posts-management/pagination";
import { SearchFilter } from "@/components/posts-management/search-filter";
import { CardView } from "@/components/posts-management/card-view";
import type { Post } from "@/types/post";
import { useGetPostsQuery, useApprovePostMutation, useRejectPostMutation } from "@/store/services/postsApi";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, List } from "lucide-react";

const ITEMS_PER_PAGE = 9;

export default function PostsPage() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<"grid" | "table">("grid");
  const { data: session } = useSession();
  const { toast } = useToast();
  const { data: postsData, isLoading, refetch } = useGetPostsQuery(
    { 
      token: session?.user.accessToken,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    },
    { skip: !session?.user.accessToken }
  );
  const [approvePost] = useApprovePostMutation();
  const [rejectPost] = useRejectPostMutation();

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
      }
      setSelectedPost(null);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the post.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredPosts = useMemo(() => {
    if (!postsData?.data) return [];

    let filtered = [...postsData.data];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.content.toLowerCase().includes(query) ||
          post.owner.firstName.toLowerCase().includes(query) ||
          post.owner.lastName.toLowerCase().includes(query) ||
          post.owner.username.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [postsData?.data, searchQuery, statusFilter]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil((postsData?.total || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts Management</h1>
          <p className="text-muted-foreground">
            Manage and moderate user posts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("table")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {view === "grid" ? (
        <CardView
          posts={currentPosts}
          onViewPost={handleViewPost}
          onPostAction={handlePostAction}
        />
      ) : (
        <PostsTable
          posts={currentPosts}
          onViewPost={handleViewPost}
          onPostAction={handlePostAction}
        />
      )}

      {postsData && (
        <PostsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={postsData.total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      <PostsDrawer
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onPostAction={handlePostAction}
      />
    </div>
  );
} 