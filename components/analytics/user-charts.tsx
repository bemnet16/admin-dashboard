"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetUsersQuery } from "@/store/services/userApi"
import { useGetPostsQuery, useGetStatsQuery } from "@/store/services/postsApi"
import { useSession } from "next-auth/react"
import { Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface Stats {
  posts: number
  reels: number
  comments: number
  users: number
}

interface UserStats {
  monthlyRegistrations: {
    labels: string[]
    data: number[]
  }
  genderDistribution: {
    labels: string[]
    data: number[]
  }
  followerRanges: {
    labels: string[]
    data: number[]
  }
  reportDistribution: {
    labels: string[]
    data: number[]
  }
}

interface Post {
  id: string
  reportCount?: number
}

export function UserCharts() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken || ""
  const { data: users } = useGetUsersQuery(token)
  const { data: postsData } = useGetPostsQuery({ token })
  const { data: stats = {
    posts: 0,
    reels: 0,
    comments: 0,
    users: 0,
  }} = useGetStatsQuery(token)
  const [userStats, setUserStats] = useState<UserStats>({
    monthlyRegistrations: { labels: [], data: [] },
    genderDistribution: { labels: [], data: [] },
    followerRanges: { labels: [], data: [] },
    reportDistribution: { labels: [], data: [] },
  })

  useEffect(() => {
    if (users && postsData?.data) {
      // Process monthly registrations
      const monthlyData = new Map<string, number>()
      users.forEach(user => {
        const date = new Date(user.createdAt)
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
        monthlyData.set(monthYear, (monthlyData.get(monthYear) || 0) + 1)
      })

      // Process gender distribution
      const genderCounts = new Map<string, number>()
      users.forEach(user => {
        const gender = user.gender || 'Unknown'
        genderCounts.set(gender, (genderCounts.get(gender) || 0) + 1)
      })

      // Process follower ranges
      const followerRanges = {
        '0-10': 0,
        '11-50': 0,
        '51+': 0,
      }
      users.forEach(user => {
        const followerCount = user.followers?.length || 0
        if (followerCount <= 10) followerRanges['0-10']++
        else if (followerCount <= 50) followerRanges['11-50']++
        else followerRanges['51+']++
      })

      // Process report distribution
      const reportRanges = {
        '0': 0,
        '1-3': 0,
        '4+': 0,
      }
      postsData.data.forEach((post: Post) => {
        const reportCount = post.reportCount || 0
        if (reportCount === 0) reportRanges['0']++
        else if (reportCount <= 3) reportRanges['1-3']++
        else reportRanges['4+']++
      })

      setUserStats({
        monthlyRegistrations: {
          labels: Array.from(monthlyData.keys()),
          data: Array.from(monthlyData.values()),
        },
        genderDistribution: {
          labels: Array.from(genderCounts.keys()),
          data: Array.from(genderCounts.values()),
        },
        followerRanges: {
          labels: Object.keys(followerRanges),
          data: Object.values(followerRanges),
        },
        reportDistribution: {
          labels: Object.keys(reportRanges),
          data: Object.values(reportRanges),
        },
      })
    }
  }, [users, postsData])

  const monthlyRegistrationsData = {
    labels: userStats.monthlyRegistrations.labels,
    datasets: [
      {
        label: 'New Registrations',
        data: userStats.monthlyRegistrations.data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  }

  const genderDistributionData = {
    labels: userStats.genderDistribution.labels,
    datasets: [
      {
        data: userStats.genderDistribution.data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',  // Blue
          'rgba(236, 72, 153, 0.5)',  // Pink
          'rgba(156, 163, 175, 0.5)', // Gray
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(236, 72, 153)',
          'rgb(156, 163, 175)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const followerRangesData = {
    labels: userStats.followerRanges.labels,
    datasets: [
      {
        label: 'Number of Users',
        data: userStats.followerRanges.data,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  }

  const reportDistributionData = {
    labels: userStats.reportDistribution.labels,
    datasets: [
      {
        label: 'Number of Posts',
        data: userStats.reportDistribution.data,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Monthly Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={monthlyRegistrationsData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Pie
              data={genderDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Follower Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={followerRangesData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Report Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={reportDistributionData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Posts</p>
              <p className="text-2xl font-bold text-blue-700">{stats.posts}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Total Reels</p>
              <p className="text-2xl font-bold text-purple-700">{stats.reels}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Total Comments</p>
              <p className="text-2xl font-bold text-green-700">{stats.comments}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-orange-700">{stats.users}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 