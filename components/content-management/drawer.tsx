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
import type { ContentItem } from "@/types/content";
import { Calendar, CheckCircle, Trash2, User, XCircle, AlertTriangle } from "lucide-react";
import { AnalysisTab } from "./analysis-tab";
import { MediaPreview } from "./media-preview";
import { NotesTab } from "./notes-tab";
import { ReportsTab } from "./reports-tab";
import { formatDateTime, getContentTypeIcon, getStatusBadge } from "./utils";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useGetContentReportsQuery } from "@/store/services/contentApi";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentDrawerProps {
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onContentAction: (contentId: string, action: string) => void;
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

const getMediaIcon = (mediaType: string | null | undefined) => {
  switch (mediaType) {
    case "video":
      return "🎥";
    case "image":
      return "🖼️";
    case "text":
      return "📝";
    default:
      return "🎥";
  }
};

export function ContentDrawer({
  content,
  isOpen,
  onClose,
  onContentAction,
  isDeleting,
}: ContentDrawerProps) {
  const { data: session } = useSession();
  const { data: reportsData } = useGetContentReportsQuery(
    { contentId: content?.id || "", token: session?.user.accessToken },
    { skip: !content?.id }
  );

  if (!content) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={content.profile.picture || "/placeholder.svg"}
                  alt={content.profile.name}
                />
                <AvatarFallback>
                  {content.profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <DrawerTitle>{content.profile.name}</DrawerTitle>
                <DrawerDescription>
                  Posted {formatDate(content.createdAt)}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-6">
              {/* Media Preview */}
              {content.videoURL && (
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <video
                    src={content.videoURL}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {content.description}
                  </p>
                </div>

                {/* Hashtags */}
                {content.hashtags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Hashtags</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.hashtags.map((tag, index) => (
                        <Badge key={`${tag}-${index}`} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Score */}
                <div>
                  <h3 className="text-sm font-medium mb-2">AI Analysis</h3>
                  <div className="p-3 bg-muted rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content Score</span>
                      <Badge variant={content.score && content.score >= 0.7 ? "default" : "destructive"}>
                        {Math.floor(content.score * 10000) / 100}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content Label</span>
                      <Badge variant="secondary">
                        {content.label || "N/A"}
                      </Badge>
                    </div>
                    {content.transcription_text && (
                      <div className="pt-2 border-t">
                        <span className="text-sm font-medium block mb-1">Transcription</span>
                        <p className="text-sm text-muted-foreground">{content.transcription_text}</p>
                        {content.transcription_label && (
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline">{content.transcription_label}</Badge>
                            {content.transcription_sentiment && (
                              <Badge variant="outline">{content.transcription_sentiment}</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Engagement</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">{content.likes}</span>
                      <span className="text-sm text-muted-foreground">Likes</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">
                        {content.favoriteCount}
                      </span>
                      <span className="text-sm text-muted-foreground">Saved</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-2xl font-bold">
                        {content.shareCount}
                      </span>
                      <span className="text-sm text-muted-foreground">Shares</span>
                    </div>
                  </div>
                </div>

                {/* Reports List */}
                {reportsData?.data && reportsData.data.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Reports ({reportsData.data.length})</h3>
                    <div className="space-y-3">
                      {reportsData.data.map((report) => (
                        <div key={report.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-sm font-medium">
                              {report.reasonDetails.mainReason}
                            </span>
                            {report.reasonDetails.subReason && (
                              <Badge variant="secondary">{report.reasonDetails.subReason}</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDate(report.createdAt)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <Badge variant="destructive">{report.status}</Badge>
                            <p className="text-sm text-muted-foreground">
                              {report.reasonDetails.details}
                            </p>
                            {report.resolutionDetails && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-sm">
                                  <span className="font-medium">Resolution: </span>
                                  {report.resolutionDetails}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Resolved on {formatDate(report.resolutionDate || '')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Settings */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Content Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Premium Content</span>
                      <Badge variant={content.isPremiumContent ? "default" : "secondary"}>
                        {content.isPremiumContent ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Comments</span>
                      <Badge variant={content.allowComments ? "default" : "secondary"}>
                        {content.allowComments ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Save to Device</span>
                      <Badge variant={content.allowSaveToDevice ? "default" : "secondary"}>
                        {content.allowSaveToDevice ? "Allowed" : "Not Allowed"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Watermark</span>
                      <Badge variant={content.saveWithWatermark ? "default" : "secondary"}>
                        {content.saveWithWatermark ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DrawerFooter className="border-t">
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                onClick={() => onContentAction(content.id, "delete")}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => onContentAction(content.id, "reject")}
                disabled={isDeleting}
              >
                <ShieldAlert className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => onContentAction(content.id, "approve")}
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
