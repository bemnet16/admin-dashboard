"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, AlertTriangle, TrendingUp, Heart, BookHeartIcon } from "lucide-react"
import { useGetUsersQuery } from "@/store/services/userApi"
import { useGetPostsQuery } from "@/store/services/postsApi"
import { useGetReportsQuery } from "@/store/services/reportsApi"
import { useSession } from "next-auth/react"
import type { Post, Report } from "@/types/post"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface TopUser {
  id: string
  username: string
  posts: number
  likes: number
  comments: number
  reports: number
  avatar?: string
}

interface ReportedContent {
  id: string
  type: string
  title: string
  reports: number
}

export function EngagementStats() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken || ""
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([])

  // Fetch data using RTK Query hooks
  const { data: users } = useGetUsersQuery(token)
  const { data: posts } = useGetPostsQuery({ token })
  const { data: reports } = useGetReportsQuery({ token })

  useEffect(() => {
    if (users && posts) {
      // Calculate user stats
      const userStats = users?.reduce((acc, user) => {
        const userPosts = posts?.data?.filter((post: Post) => post.owner.id === user.id) || []
        if (userPosts.length === 0) return acc // Skip users with no posts
        
        const totalLikes = userPosts.reduce((sum: number, post: Post) => sum + (post.likedBy?.length || 0), 0)
        const totalComments = userPosts.reduce((sum: number, post: Post) => sum + (post.commentIds?.length || 0), 0)
        const totalReports = userPosts.reduce((sum: number, post: Post) => sum + (post.reportCount || 0), 0)
        
        acc.push({
          id: user.id,
          username: user.username || user.firstName + ' ' + user.lastName,
          posts: userPosts.length,
          likes: totalLikes,
          comments: totalComments,
          reports: totalReports,
          avatar: user.profilePic
        })
        return acc
      }, [] as TopUser[])
      .sort((a, b) => {
        // First sort by total likes (descending)
        if (b.likes !== a.likes) {
          return b.likes - a.likes
        }
        // If likes are equal, sort by number of posts (descending)
        return b.posts - a.posts
      })
      .slice(0, 5)

      // Calculate reported content
      const reportedPosts = posts.data.map(post => {
        const postReports = reports?.report?.filter(report => report.contentId === post.id) || []
        return {
          id: post.id,
          type: "Post",
          title: post.content || "Untitled Post",
          reports: postReports.length,
        }
      })

      // Sort by number of reports and take top 3
      const topReported = reportedPosts
        .filter(item => item.reports > 0)
        .sort((a, b) => b.reports - a.reports)
        .slice(0, 3)

      setTopUsers(userStats)
      setReportedContent(topReported)
    }
  }, [users, posts, reports])

  const maxLikes = Math.max(...topUsers.map(user => user.likes), 1)

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="p-2 rounded-full bg-yellow-500/10">
              <BookHeartIcon className="h-5 w-5 text-yellow-500" />
            </div>
            Top Post Creators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topUsers.map((user, index) => (
              <Link 
                href={`/users/${user.id}`} 
                key={user.id}
                className="block hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4 p-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{user.username}</p>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">{user.likes.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress value={(user.likes / maxLikes) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground">{user.posts} posts</p>
                  </div>
                </div>
              </Link>
            ))}
            {topUsers.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No creators found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 