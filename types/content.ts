export interface ContentItem {
  id: string;
  profile: {
    id: string;
    online: boolean;
    picture: string;
    name: string;
  };
  videoURL: string;
  description: string;
  isPremiumContent: boolean;
  duration: number;
  hashtags: string[];
  mentionedUsers: any[];
  allowComments: boolean;
  allowSaveToDevice: boolean;
  saveWithWatermark: boolean;
  audienceControlUnder18: boolean;
  likes: number;
  comments: number;
  favoriteCount: number;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  privacy: string;
  isLikedByUser: boolean;
}

export interface ContentAction {
  id: string;
  label: string;
  icon: string;
  variant?: string;
}

export type ViewMode = "table" | "cards";
