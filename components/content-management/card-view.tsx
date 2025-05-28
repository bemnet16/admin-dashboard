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
import { Eye, MoreHorizontal, ShieldAlert, ShieldCheck } from "lucide-react";
import type { ContentItem } from "@/types/content";

interface CardViewProps {
  contentItems: ContentItem[];
  onViewContent: (content: ContentItem) => void;
  onContentAction: (contentId: string, action: string) => void;
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

export function CardView({
  contentItems,
  onViewContent,
  onContentAction,
}: CardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contentItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={item.profile.picture || "/placeholder.svg"}
                  alt={item.profile.name}
                />
                <AvatarFallback>
                  {item.profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{item.profile.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getMediaIcon(item.mediaType)}
                <Badge variant="outline">
                  {item.mediaType || "video"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {truncateText(item.description, 100)}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                  <span className="font-medium">{item.likes}</span>
                  <span className="text-muted-foreground">Likes</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                  <span className="font-medium">{item.favoriteCount}</span>
                  <span className="text-muted-foreground">Saved</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                  <span className="font-medium">{item.shareCount}</span>
                  <span className="text-muted-foreground">Shares</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewContent(item)}
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
                  onClick={() => onContentAction(item.id, "approve")}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onContentAction(item.id, "reject")}
                >
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  Reject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
