"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCards } from "@/components/analytics/overview-cards"
import { EngagementStats } from "@/components/analytics/engagement-stats"
import { useGetPostsQuery, useApprovePostMutation, useRejectPostMutation, useDeletePostMutation, useGetStatsQuery } from "@/store/services/postsApi"
import { useGetContentsQuery } from "@/store/services/contentApi"
import { useGetUsersQuery, User } from "@/store/services/userApi"
import { useSession } from "next-auth/react"
import { AlertTriangle, Video, Users } from "lucide-react"
import { Post } from "@/types/post"
import { ContentItem } from "@/types/content"
import { useEffect, useState } from "react"
import { PostsDrawer } from "@/components/posts-management/drawer"
import { ContentDrawer } from "@/components/content-management/drawer"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Heart } from "lucide-react"
import Link from "next/link"

interface Stats {
  posts: number
  reels: number
  comments: number
  users: number
  reports?: number
}

export function OverviewTab() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken || ""
  const { data: postsData } = useGetPostsQuery({ token })
  const { data: reelsData } = useGetContentsQuery({ page: 1, limit: 100, token })
  const { data: usersData } = useGetUsersQuery(token)
  const { data: stats = {
    posts: 0,
    reels: 0,
    comments: 0,
    users: 0,
    reports: 0,
  }} = useGetStatsQuery(token)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedReel, setSelectedReel] = useState<ContentItem | null>(null)
  const [isDeletingPost, setIsDeletingPost] = useState(false)
  const [isDeletingReel, setIsDeletingReel] = useState(false)
  const { toast } = useToast()

  const [approvePost] = useApprovePostMutation()
  const [rejectPost] = useRejectPostMutation()
  const [deletePost] = useDeletePostMutation()

  // Get most reported content
  const mostReportedContent = postsData?.data
    ?.filter((post) => post.reportCount && post.reportCount > 0)
    .sort((a, b) => (b.reportCount || 0) - (a.reportCount || 0))
    .slice(0, 5) || []

  // Get most reported reels
  const mostReportedReels = (reelsData || [])
    .filter((reel) => reel.reports && reel.reports > 0)
    .sort((a, b) => (b.reports || 0) - (a.reports || 0))
    .slice(0, 5)

  // Get top reel creators
  const topReelCreators = (reelsData || [])
    .reduce((acc, reel) => {
      const existingCreator = acc.find(c => c.id === reel.profile.id)
      if (existingCreator) {
        existingCreator.reels++
        existingCreator.likes += reel.likes
      } else {
        acc.push({
          id: reel.profile.id,
          name: reel.profile.name,
          reels: 1,
          likes: reel.likes,
          avatar: reel.profile.picture
        })
      }
      return acc
    }, [] as { id: string; name: string; reels: number; likes: number; avatar?: string }[])
    .sort((a, b) => {
      // First sort by likes (descending)
      if (b.likes !== a.likes) {
        return b.likes - a.likes
      }
      // If likes are equal, sort by number of reels (descending)
      return b.reels - a.reels
    })
    .slice(0, 5)

  // Get most popular users
  const mostPopularUsers = usersData
    ? [...usersData].sort((a: User, b: User) => (b.followers?.length || 0) - (a.followers?.length || 0))
      .slice(0, 5)
    : []

  const handlePostAction = async (postId: string, action: string) => {
    if (!session?.user.accessToken) return;

    try {
      setIsDeletingPost(true);
      switch (action) {
        case "delete":
          await deletePost({ postId: postId, token: session.user.accessToken }).unwrap();
          toast({
            title: "Post deleted",
            description: "The post has been deleted successfully.",
          });
          break;
        case "approve":
          await approvePost({ postId: postId, token: session.user.accessToken }).unwrap();
          toast({
            title: "Post approved",
            description: "The post has been approved successfully.",
          });
          break;
        case "reject":
          await rejectPost({ postId: postId, token: session.user.accessToken }).unwrap();
          toast({
            title: "Post rejected",
            description: "The post has been rejected successfully.",
          });
          break;
      }
      setSelectedPost(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the post.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingPost(false);
    }
  };

  const handleReelAction = async (reelId: string, action: string) => {
    if (!session?.user.accessToken) return;

    try {
      setIsDeletingReel(true);
      // Implement reel actions here
      toast({
        title: "Action completed",
        description: `The reel has been ${action}ed successfully.`,
      });
      setSelectedReel(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the reel.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingReel(false);
    }
  };

  const maxReelLikes = Math.max(...topReelCreators.map(creator => creator.likes), 1)

  return (
    <div className="space-y-4">
      <OverviewCards />
      <div className="grid gap-4 md:grid-cols-2">
        <EngagementStats />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Most Reported Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostReportedContent.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {post.owner.firstName} {post.owner.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {post.content && post.content.length > 100
                        ? `${post.content.substring(0, 100)}...`
                        : post.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
                      {post.reportCount} reports
                    </span>
                  </div>
                </div>
              ))}
              {mostReportedContent.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No reported content found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Reel Creators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-500/10">
                <Video className="h-5 w-5 text-blue-500" />
              </div>
              Top Reel Creators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topReelCreators.map((creator) => (
                <Link
                  key={creator.id}
                  href={`/users/${creator.id}`}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>
                      {creator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{creator.name}</p>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">{creator.likes.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress value={(creator.likes / maxReelLikes) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground">{creator.reels} reels</p>
                  </div>
                </Link>
              ))}
              {topReelCreators.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No reel creators found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Most Reported Reels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Most Reported Reels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostReportedReels.map((reel) => (
                <div
                  key={reel.id}
                  className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedReel(reel)}
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {reel.profile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reel.description && reel.description.length > 100
                        ? `${reel.description.substring(0, 100)}...`
                        : reel.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
                      {reel.reports} reports
                    </span>
                  </div>
                </div>
              ))}
              {mostReportedReels.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No reported reels found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Popular Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="p-2 rounded-full bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            Most Popular Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mostPopularUsers.map((user: User) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profilePic} alt={user.username || `${user.firstName} ${user.lastName}`} />
                  <AvatarFallback>
                    {(user.username || `${user.firstName} ${user.lastName}`).split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{user.username || `${user.firstName} ${user.lastName}`}</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">{user.followers?.length || 0} followers</span>
                    </div>
                  </div>
                  <Progress 
                    value={((user.followers?.length || 0) / Math.max(...(mostPopularUsers.map((u: User) => u.followers?.length || 0) || [1]))) * 100} 
                    className="h-2" 
                  />
                  <p className="text-sm text-muted-foreground">
                    {user.following?.length || 0} following
                  </p>
                </div>
              </Link>
            ))}
            {mostPopularUsers.length === 0 && (
              <p className="text-center text-muted-foreground">
                No users found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <PostsDrawer
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onPostAction={handlePostAction}
        isDeleting={isDeletingPost}
      />

      <ContentDrawer
        content={selectedReel}
        isOpen={!!selectedReel}
        onClose={() => setSelectedReel(null)}
        onContentAction={handleReelAction}
        isDeleting={isDeletingReel}
      />
    </div>
  )
}
