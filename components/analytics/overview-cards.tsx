"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetUsersQuery } from "@/store/services/userApi"
import { useGetPostsQuery } from "@/store/services/postsApi"
import { useSession } from "next-auth/react"
import { Users, FileText, Video, AlertTriangle, Star, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface Reports {
  posts: number
  reels: number
  total: number
}

interface Stats {
  posts: number
  reels: number
  comments: number
  users: number
  reports: Reports
}

export function OverviewCards() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken || ""
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    reels: 0,
    comments: 0,
    users: 0,
    reports: {
      posts: 0,
      reels: 0,
      total: 0
    }
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

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      description: "Total registered users",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Posts",
      value: stats.posts,
      icon: FileText,
      description: "Total posts created",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Reels",
      value: stats.reels,
      icon: Video,
      description: "Total reels created",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Reported Content",
      value: stats.reports.total,
      icon: AlertTriangle,
      description: `Posts: ${stats.reports.posts}, Reels: ${stats.reports.reels}`,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Comments",
      value: stats.comments,
      icon: Star,
      description: "Total comments across all content",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Engagement Rate",
      value: `${((stats.comments / (stats.posts + stats.reels)) * 100).toFixed(1)}%`,
      icon: TrendingUp,
      description: "Comments per content item",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <div className={`rounded-full p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
