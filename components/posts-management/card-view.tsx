"use client";

import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, ShieldAlert, ShieldCheck, Image, Video, Trash2 } from "lucide-react";
import type { Post } from "@/types/post";

interface CardViewProps {
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

const truncateText = (text: string | null | undefined, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const getFileType = (url: string) => {
  const extension = url.split('.').pop()?.toLowerCase();
  if (['mp4', 'mov', 'avi'].includes(extension || '')) {
    return 'video';
  }
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
    return 'image';
  }
  return 'unknown';
};

export function CardView({
  posts,
  onViewPost,
  onPostAction,
  isDeleting,
}: CardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="flex flex-col h-[280px]">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-3">
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
              <div className="flex flex-col">
                <span className="font-medium">
                  {post.owner.firstName} {post.owner.lastName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 flex-1">
            <div className="space-y-4">
              {post.files.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getFileType(post.files[0]) === 'video' ? (
                      <Video className="h-3 w-3" />
                    ) : (
                      <Image className="h-3 w-3" />
                    )}
                    {post.files.length} {post.files.length === 1 ? 'file' : 'files'}
                  </Badge>
                </div>
              )}
              {post.content && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.content}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                  <span className="font-medium">{post.likedBy.length}</span>
                  <span className="text-muted-foreground">Likes</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                  <span className="font-medium">{post.commentIds.length}</span>
                  <span className="text-muted-foreground">Comments</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 