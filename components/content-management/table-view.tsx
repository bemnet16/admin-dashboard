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
import type { ContentItem, ContentAction } from "@/types/content";

interface TableViewProps {
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

export function TableView({
  contentItems,
  onViewContent,
  onContentAction,
}: TableViewProps) {

  console.log(contentItems, "ccccc")
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead>Reports</TableHead>
            <TableHead>AI Score</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contentItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
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
              </TableCell>
              <TableCell>
                <div className="max-w-[300px] truncate">
                  {truncateText(item.description, 50)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getMediaIcon(item.mediaType)}
                  <Badge variant="outline">
                    {item.mediaType || "video"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Likes:</span>
                    <span className="font-medium">{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Saved:</span>
                    <span className="font-medium">{item.favoriteCount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Shares:</span>
                    <span className="font-medium">{item.shareCount}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.reports || 0}</Badge>
              </TableCell>
              <TableCell>{item.aiScore || 0}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
