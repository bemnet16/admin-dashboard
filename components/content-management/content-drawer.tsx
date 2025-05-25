"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContentItem } from "@/types/content";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ExternalLink,
  Flag,
  ImageIcon,
  MessageSquare,
  Trash2,
  User,
  Video,
  XCircle,
  AlertCircle,
  ShoppingCart,
  Shield,
} from "lucide-react";

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Reported
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Flag className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      case "video":
        return <Video className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "post":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const renderMedia = () => {
    if (content.mediaType === "image") {
      return (
        <div className="rounded-md overflow-hidden border my-4">
          <img
            src={content.mediaUrl || "/placeholder.svg?height=400&width=600"}
            alt="Content"
            className="w-full object-cover max-h-[400px]"
          />
        </div>
      );
    } else if (content.mediaType === "video") {
      return (
        <div className="rounded-md overflow-hidden border my-4">
          <video
            src={
              content.mediaUrl ||
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
            controls
            className="w-full max-h-[400px]"
            poster="/placeholder.svg?height=400&width=600"
          />
        </div>
      );
    }
    return null;
  };

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
                  {formatDate(content.postedAt)}
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-auto text-xs">
                <User className="h-3.5 w-3.5 mr-1" />
                View User Profile
              </Button>
            </div>

            {renderMedia()}

            <div className="text-sm mb-6 whitespace-pre-wrap">
              {content.content}
            </div>

            <Tabs defaultValue="reports">
              <TabsList className="w-full">
                <TabsTrigger value="reports">Reports & Flags</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="notes">Moderator Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="reports" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Report Summary</h3>
                    <Badge variant="outline">{content.reports} Reports</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="font-medium text-sm">Hate Speech</span>
                        <Badge variant="outline" className="ml-auto">
                          3 reports
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Content contains language that may be offensive or
                        harmful to certain groups.
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <Flag className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-sm">
                          Misinformation
                        </span>
                        <Badge variant="outline" className="ml-auto">
                          2 reports
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Content contains false or misleading information.
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">Harassment</span>
                        <Badge variant="outline" className="ml-auto">
                          4 reports
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Content targets individuals with abusive or threatening
                        language.
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">Spam/Scam</span>
                        <Badge variant="outline" className="ml-auto">
                          1 report
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Content appears to be unsolicited advertising or a
                        potential scam.
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-sm">Violence</span>
                        <Badge variant="outline" className="ml-auto">
                          2 reports
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Content depicts or promotes violence or harm to
                        individuals.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">AI Moderation Score</h3>
                    <div className="flex items-center gap-2">
                      <Progress value={content.aiScore} className="h-2 w-24" />
                      <span className="text-sm font-medium">
                        {content.aiScore}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">Toxicity</span>
                        <Badge
                          variant={
                            content.aiScore > 70 ? "destructive" : "outline"
                          }
                        >
                          {content.aiScore > 70 ? "High" : "Low"}
                        </Badge>
                      </div>
                      <Progress value={content.aiScore} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        The content has been flagged for potentially toxic
                        language or themes.
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          Policy Violation
                        </span>
                        <Badge variant="outline">Medium</Badge>
                      </div>
                      <Progress value={55} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        The content may violate community guidelines regarding
                        acceptable content.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Moderator Notes</h3>
                    <Button variant="outline" size="sm" className="text-xs">
                      Add Note
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">John Doe</span>
                        <span className="text-xs text-muted-foreground">
                          2 hours ago
                        </span>
                      </div>
                      <p className="text-sm">
                        Content reviewed and flagged for further investigation.
                        The user has previous violations.
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">Alice Smith</span>
                        <span className="text-xs text-muted-foreground">
                          Yesterday
                        </span>
                      </div>
                      <p className="text-sm">
                        Initial review completed. Content appears to violate our
                        hate speech policy.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Related Content</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Previous Post</span>
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
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      External Context
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This content may be related to a trending topic with
                    misinformation concerns.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs p-0 h-auto mt-1"
                  >
                    View Context
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <div className="flex flex-col sm:flex-row gap-2">
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
