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
import { Calendar, CheckCircle, Trash2, User, XCircle } from "lucide-react";
import { AnalysisTab } from "./analysis-tab";
import { MediaPreview } from "./media-preview";
import { NotesTab } from "./notes-tab";
import { ReportsTab } from "./reports-tab";
import { formatDateTime, getContentTypeIcon, getStatusBadge } from "./utils";

interface ContentDrawerProps {
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onContentAction: (contentId: string, action: string) => void;
}

export function ContentDrawer({
  content,
  isOpen,
  onClose,
  onContentAction,
}: ContentDrawerProps) {
  if (!content) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getContentTypeIcon(content.contentType)}
                <span className="capitalize">{content.contentType} Review</span>
              </div>
              {getStatusBadge(content.status)}
            </DrawerTitle>
            <DrawerDescription>
              Review and moderate this content
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 overflow-y-auto max-h-[calc(90vh-12rem)]">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={content.user.avatar || "/placeholder.svg"}
                  alt={content.user.name}
                />
                <AvatarFallback>{content.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{content.user.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateTime(content.postedAt)}
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-auto text-xs">
                <User className="h-3.5 w-3.5 mr-1" />
                View User Profile
              </Button>
            </div>

            <MediaPreview
              mediaType={content.mediaType}
              mediaUrl={content.mediaUrl}
            />

            <div className="text-sm mb-6 whitespace-pre-wrap">
              {content.content}
            </div>

            <Tabs defaultValue="reports">
              <TabsList className="w-full">
                <TabsTrigger value="reports">Reports & Flags</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="notes">Moderator Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="reports" className="mt-4">
                <ReportsTab />
              </TabsContent>

              <TabsContent value="analysis" className="mt-4">
                <AnalysisTab aiScore={content.aiScore} />
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <NotesTab />
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Related Content</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    {getContentTypeIcon("post")}
                    <span className="text-sm font-medium">Previous Posts</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This user has 3 other posts that have been reported in the
                    last 30 days.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs p-0 h-auto mt-1"
                  >
                    View History
                  </Button>
                </div>

                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    {getContentTypeIcon("comment")}
                    <span className="text-sm font-medium">Recent Comments</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This user has made 5 comments in the last week, with 2 being
                    reported.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs p-0 h-auto mt-1"
                  >
                    View Comments
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <div className="flex flex-col sm:flex-row gap-2 -mt-3">
              <Button
                variant="outline"
                className="sm:flex-1 gap-2"
                onClick={() => onContentAction(content.id, "approve")}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="sm:flex-1 gap-2"
                onClick={() => onContentAction(content.id, "reject")}
              >
                <XCircle className="h-4 w-4 text-amber-500" />
                Reject
              </Button>
              <Button
                variant="destructive"
                className="sm:flex-1 gap-2"
                onClick={() => onContentAction(content.id, "delete")}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
