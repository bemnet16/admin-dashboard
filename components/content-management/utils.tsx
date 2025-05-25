import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Flag,
  ImageIcon,
  MessageSquare,
  Video,
  XCircle,
} from "lucide-react";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const getStatusBadge = (status: string) => {
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

export const getMediaIcon = (mediaType: string) => {
  switch (mediaType) {
    case "image":
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    case "video":
      return <Video className="h-4 w-4 text-purple-500" />;
    default:
      return null;
  }
};

export const getContentTypeIcon = (contentType: string) => {
  switch (contentType) {
    case "post":
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case "comment":
      return <MessageSquare className="h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
};

export const renderAIScore = (score: number) => {
  return (
    <div className="flex items-center gap-2">
      <Progress value={score} className="h-2 w-16" />
      <span className="text-sm font-medium">{score}%</span>
    </div>
  );
};
