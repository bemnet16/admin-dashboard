"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCards } from "@/components/analytics/overview-cards"
import { EngagementStats } from "@/components/analytics/engagement-stats"
import { useGetPostsQuery } from "@/store/services/postsApi"
import { useSession } from "next-auth/react"
import { AlertTriangle } from "lucide-react"
import { Post } from "@/types/post"
import { useEffect, useState } from "react"

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
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    reels: 0,
    comments: 0,
    users: 0,
    reports: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  // Get most reported content
  const mostReportedContent = postsData?.data
    ?.filter((post) => post.reportCount && post.reportCount > 0)
    .sort((a, b) => (b.reportCount || 0) - (a.reportCount || 0))
    .slice(0, 5) || []

  return (
    <div className="space-y-4">
      <OverviewCards />
      <div className="grid gap-4 md:grid-cols-2">
        <EngagementStats />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Most Reported Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostReportedContent.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border p-4"
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
      </div>
    </div>
  )
}
