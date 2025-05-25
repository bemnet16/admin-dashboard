"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import type { ContentItem } from "@/types/content";
import { CheckCircle, ChevronDown, Eye, Trash2, XCircle } from "lucide-react";
import {
  formatDate,
  getContentTypeIcon,
  getMediaIcon,
  getStatusBadge,
  truncateText,
} from "./utils";

interface CardViewProps {
  items: ContentItem[];
  onViewContent: (content: ContentItem) => void;
  onContentAction: (contentId: string, action: string) => void;
}

export function CardView({
  items,
  onViewContent,
  onContentAction,
}: CardViewProps) {
  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-muted-foreground">
        No content found matching your filters
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 pb-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={item.user.avatar || "/placeholder.svg"}
                      alt={item.user.name}
                    />
                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{item.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(item.postedAt)}
                    </div>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {getContentTypeIcon(item.contentType)}
                    <span className="capitalize">{item.contentType}</span>
                  </div>
                  {item.mediaType !== "text" && (
                    <div className="flex items-center gap-1">
                      {getMediaIcon(item.mediaType)}
                      <span className="capitalize">{item.mediaType}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm">{truncateText(item.content, 100)}</p>
              </div>

              <div className="flex items-center justify-between mb-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Reports: </span>
                  <span className="font-medium">{item.reports}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <span>{item.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">AI Score:</span>
                <Progress value={item.aiScore} className="h-2 flex-1" />
                <span className="text-xs font-medium">{item.aiScore}%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onViewContent(item)}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              View Full
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  Actions
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onContentAction(item.id, "approve")}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onContentAction(item.id, "reject")}
                >
                  <XCircle className="h-4 w-4 mr-2 text-amber-500" />
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onContentAction(item.id, "delete")}
                >
                  <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
