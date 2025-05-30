"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type { Post } from "@/types/post";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostsTableProps {
  posts: Post[];
  onViewPost: (post: Post) => void;
  onPostAction: (postId: string, action: string) => void;
  isDeleting: boolean;
}

const formatDate = (date: string | null | undefined) => {
  if (!date) return "Invalid date";
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

export function PostsTable({ posts, onViewPost, onPostAction, isDeleting }: PostsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Media</TableHead>
            <TableHead>Engagement</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={post.owner.picture || undefined}
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
                <p className="line-clamp-2">{post.content || "No text content"}</p>
                {post.files.length > 0 && (
                  <Badge variant="outline" className="mt-1">
                    {post.files.length} {post.files.length === 1 ? "file" : "files"}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {post.files.length > 0 ? (
                  <Badge variant="secondary">
                    {post.files.length} {post.files.length === 1 ? "file" : "files"}
                  </Badge>
                ) : (
                  <Badge variant="outline">No media</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Badge variant="secondary">{post.likedBy.length} likes</Badge>
                  <Badge variant="secondary">{post.commentIds.length} comments</Badge>
                </div>
              </TableCell>
              <TableCell>{formatDate(post.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewPost(post)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isDeleting}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onPostAction(post.id, "delete")}
                        className="text-destructive"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Post
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