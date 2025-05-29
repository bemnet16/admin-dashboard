"use client";

import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Eye, MoreHorizontal, ShieldAlert, ShieldCheck } from "lucide-react";
import type { Post } from "@/types/post";

interface PostsTableProps {
  posts: Post[];
  onViewPost: (post: Post) => void;
  onPostAction: (postId: string, action: string) => void;
}

const formatDate = (date: string | null | undefined) => {
  if (!date) return "Invalid date";
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

const getStatusBadge = (status: Post["status"]) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
};

export function PostsTable({ posts, onViewPost, onPostAction }: PostsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Engagement</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={post.owner.picture || "/placeholder.svg"}
                      alt={`${post.owner.firstName} ${post.owner.lastName}`}
                    />
                    <AvatarFallback>
                      {post.owner.firstName[0]}
                      {post.owner.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {post.owner.firstName} {post.owner.lastName}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="line-clamp-2">{post.content}</p>
                {post.files.length > 0 && (
                  <Badge variant="outline" className="mt-1">
                    {post.files.length} {post.files.length === 1 ? "file" : "files"}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(post.status)}</TableCell>
              <TableCell>{formatDate(post.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{post.likedBy.length}</span>
                    <span className="text-muted-foreground">likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{post.commentIds.length}</span>
                    <span className="text-muted-foreground">comments</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewPost(post)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onPostAction(post.id, "approve")}
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onPostAction(post.id, "reject")}
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 