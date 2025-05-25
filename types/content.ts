export interface ContentItem {
  id: string;
  content: string;
  contentType: string;
  mediaType: string;
  mediaUrl?: string;
  status: string;
  postedAt: string;
  reports: number;
  flaggedReason: string;
  aiScore: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface ContentAction {
  id: string;
  label: string;
  icon: string;
  variant?: string;
}

export type ViewMode = "table" | "cards";
