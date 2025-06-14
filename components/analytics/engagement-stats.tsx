"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, AlertTriangle, TrendingUp, Heart } from "lucide-react"
import { useGetUsersQuery } from "@/store/services/userApi"
import { useGetPostsQuery } from "@/store/services/postsApi"
import { useGetReportsQuery } from "@/store/services/reportsApi"
import { useSession } from "next-auth/react"
import type { Post, Report } from "@/types/post"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface TopUser {
  id: string
  username: string
  posts: number
  likes: number
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
      console.log('Users from API:', users) // Debug log
      
      // Calculate top users
      const userStats = users.map(user => {
        const userPosts = posts.data.filter(post => post.owner.id === user.id)
        const totalLikes = userPosts.reduce((acc, post) => acc + (post.likedBy?.length || 0), 0)
        const userData = {
          id: user.id || `user-${Math.random()}`, // Fallback ID if none exists
          username: user.username || "Anonymous User",
          posts: userPosts.length,
          likes: totalLikes,
          avatar: user.profilePic,
        }
        console.log('Processed user data:', userData) // Debug log
        return userData
      })

      // Sort users by engagement (posts + likes)
      const sortedUsers = userStats
        .sort((a, b) => (b.posts + b.likes) - (a.posts + a.likes))
        .slice(0, 5)

      console.log('Sorted users:', sortedUsers) // Debug log

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

      setTopUsers(sortedUsers)
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
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            Top Creators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topUsers.map((user, index) => (
              <div key={`${user.id}-${index}`} className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    {user.username?.slice(0, 2).toUpperCase() || "AU"}
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
            ))}
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
} 