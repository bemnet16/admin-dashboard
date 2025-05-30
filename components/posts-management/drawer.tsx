"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Post } from "@/types/post";
import { Calendar, CheckCircle, Trash2, User, XCircle, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useGetPostReportsQuery } from "@/store/services/postsApi";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PostsDrawerProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
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

export function PostsDrawer({
  post,
  isOpen,
  onClose,
  onPostAction,
  isDeleting,
}: PostsDrawerProps) {
  const { data: session } = useSession();
  const { data: reportsData } = useGetPostReportsQuery(
    { postId: post?.id || "", token: session?.user.accessToken || "" },
    { skip: !post?.id || !session?.user.accessToken }
  );

  if (!post) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
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
                <DrawerTitle>
                  {post.owner.firstName} {post.owner.lastName}
                </DrawerTitle>
                <DrawerDescription>
                  Posted {formatDate(post.createdAt)}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-6">
              {/* Media Preview */}
              {post.files.length > 0 && (
                <div className="space-y-4">
                  {post.files.map((file, index) => (
                    <div key={index} className="rounded-lg overflow-hidden bg-muted">
                      {getFileType(file) === 'video' ? (
                        <video
                          src={file}
                          controls
                          className="w-full max-h-[400px] object-contain"
                        />
                      ) : (
                        <img
                          src={file}
                          alt={`Post media ${index + 1}`}
                          className="w-full max-h-[400px] object-contain"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Content Details */}
              <div className="space-y-4">
                {post.content && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Content</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                )}

                {/* Engagement Metrics */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Engagement</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{post.likedBy.length}</span>
                      <span className="text-sm text-muted-foreground">Likes</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{post.commentIds.length}</span>
                      <span className="text-sm text-muted-foreground">Comments</span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <h3 className="text-sm font-medium mb-2">User Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Username</span>
                      <Badge variant="secondary">@{post.owner.username}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Following</span>
                      <Badge variant="secondary">{post.owner.following.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Followers</span>
                      <Badge variant="secondary">{post.owner.followers.length}</Badge>
                    </div>
                  </div>
                </div>

                {/* Reports List */}
                {reportsData?.report && reportsData.report.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Reports ({reportsData.report.length})</h3>
                    <div className="space-y-3">
                      {reportsData.report.map((report) => (
                        <div key={report.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-sm font-medium">
                              {report.mainReason}
                            </span>
                            <Badge variant="secondary">{report.subreason}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(report.createdAt)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <Badge variant="destructive">{report.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <DrawerFooter className="border-t">
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                onClick={() => onPostAction(post.id, "delete")}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => onPostAction(post.id, "reject")}
                disabled={isDeleting}
              >
                <ShieldAlert className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => onPostAction(post.id, "approve")}
                disabled={isDeleting}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 