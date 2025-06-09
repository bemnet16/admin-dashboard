"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

// Import our custom components
import { UserInfoCard } from "@/components/users/user-info-card";
import { ContentTab } from "@/components/users/content-tab";
import { BalanceTab } from "@/components/users/balance-tab";
import { ActionsTab } from "@/components/users/actions-tab";

// Import mock data for tabs (temporary)
import { transactionData } from "@/lib/mock-data";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  profilePic?: string;
  // Additional fields required by components
  fullName: string;
  walletAddress: string;
  status: string;
  verified: boolean;
  joinDate: string;
  avatarUrl: string;
  tokenBalance: number;
  // Social stats
  followers: number;
  following: number;
}

interface ContentData {
  id: string;
  type: string;
  contentType: string;
  preview: string;
  mediaItems?: {
    type: string;
    url: string;
    thumbnailUrl?: string;
  }[];
  date: string;
  likes: number;
  shares: number;
  status: string;
}

interface PostResponse {
  id: string;
  content: string;
  files: string[];
  commentIds: string[];
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
  owner: {
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
  };
}

export default function UserProfilePage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [contentData, setContentData] = useState<ContentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserContent = async () => {
    try {
      const contentResponse = await fetch(`http://localhost:3000/social/posts/${id}/user`, {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      });

      if (!contentResponse.ok) {
        throw new Error('Failed to fetch user content');
      }

      const contentData = await contentResponse.json();
      
      // Transform content data to match the expected format
      const transformedContent: ContentData[] = contentData.data.map((post: PostResponse) => ({
        id: post.id,
        type: "Post",
        contentType: post.files?.length > 0 ? "mixed" : "text",
        preview: post.content || "No text content",
        mediaItems: post.files?.map((fileUrl: string) => {
          const fileType = fileUrl.toLowerCase().endsWith('.mp4') ? 'video' : 'image';
          return {
            type: fileType,
            url: fileUrl,
            thumbnailUrl: fileType === 'video' ? fileUrl : undefined
          };
        }),
        date: post.createdAt,
        likes: post.likedBy?.length || 0,
        shares: 0, // API doesn't provide shares count
        status: "Approved" // Default status since API doesn't provide it
      }));

      setContentData(transformedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        // Transform API response to match component requirements
        const transformedData: UserData = {
          ...data,
          fullName: `${data.firstName} ${data.lastName}`,
          avatarUrl: data.profilePic || "/placeholder.svg",
          status: data.role === "Suspended" ? "Suspended" : "Active",
          verified: data.role === "Admin",
          joinDate: new Date().toLocaleDateString(), // You might want to get this from the API
          walletAddress: "0x0000000000000000000000000000000000000000", // Placeholder, get from API
          tokenBalance: 0, // Placeholder, get from API
          followers: data.followers?.length || 0,
          following: data.following?.length || 0,
        };
        
        setUserData(transformedData);

        // Fetch initial user content
        await fetchUserContent();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user.accessToken) {
      fetchUserData();
    }
  }, [id, session?.user.accessToken]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-destructive">Error: {error}</p>
          <Link href="/users">
            <Button variant="outline">Back to Users</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">User not found</p>
          <Link href="/users">
            <Button variant="outline">Back to Users</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6 flex items-center">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <Link href="/users" className="ml-auto">
          <Button variant="outline" size="sm" className="ml-auto">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>

      {/* User Information Card */}
      <UserInfoCard user={userData} />

      {/* Social Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{userData.followers}</p>
          <p className="text-sm text-muted-foreground">Followers</p>
        </div>
        <div className="bg-card rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{userData.following}</p>
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="balance">Balance & Transactions</TabsTrigger>
          <TabsTrigger value="actions">Admin Actions</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <ContentTab 
            contentData={contentData} 
            onContentDeleted={fetchUserContent}
          />
        </TabsContent>

        {/* Balance & Transactions Tab */}
        <TabsContent value="balance" className="space-y-4">
          <BalanceTab userData={userData} transactionData={transactionData} />
        </TabsContent>

        {/* Admin Actions Tab */}
        <TabsContent value="actions">
          <ActionsTab userData={userData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
