export interface PostOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  role: string;
  username: string;
  bio: string;
  profilePic: string;
  following: string[];
  followers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  contentId: string;
  reporterId: string | null;
  mainReason: string;
  subreason: string;
  status: "PENDING" | "RESOLVED" | "REJECTED";
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string | null;
  files: string[];
  commentIds: string[];
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    picture: string | null;
  };
  reports?: Report[];
  status: "pending" | "approved" | "rejected";
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface ReportsResponse {
  report: Report[];
} 