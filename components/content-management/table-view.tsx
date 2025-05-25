"use client";

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
import type { ContentItem } from "@/types/content";
import {
  CheckCircle,
  Eye,
  MoreHorizontal,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  formatDate,
  getContentTypeIcon,
  getMediaIcon,
  getStatusBadge,
  renderAIScore,
  truncateText,
} from "./utils";

interface TableViewProps {
  items: ContentItem[];
  onViewContent: (content: ContentItem) => void;
  onContentAction: (contentId: string, action: string) => void;
}

export function TableView({
  items,
  onViewContent,
  onContentAction,
}: TableViewProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">User</TableHead>
              <TableHead className="min-w-[200px]">Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Reports</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center h-24 text-muted-foreground"
                >
                  No content found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={item.user.avatar || "/placeholder.svg"}
                          alt={item.user.name}
                        />
                        <AvatarFallback>
                          {item.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{item.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {item.user.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMediaIcon(item.mediaType)}
                      <span className="text-sm">
                        {truncateText(item.content, 50)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getContentTypeIcon(item.contentType)}
                      <span className="capitalize">{item.contentType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(item.postedAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.reports}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{renderAIScore(item.aiScore)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewContent(item)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
