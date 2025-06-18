import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, ThumbsUp, Flag } from "lucide-react";
import { useGetLikeAnalyticsQuery } from "@/store/services/contentApi";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

interface SocialHealthData {
  overallScore: number;
  positiveInteractions: number;
  negativeReports: number;
  spamFlags: number;
  recentWarnings: {
    type: string;
    message: string;
    date: string;
  }[];
  interactionMetrics: {
    categories: {
      political: number;
      religious: number;
      cultural: number;
      entertainment: number;
      technology: number;
    };
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
    toxicity: {
      hateSpeech: number;
      harassment: number;
      misinformation: number;
      spam: number;
    };
  };
  timeBasedData: {
    date: string;
    score: number;
  }[];
  contentDistribution: {
    type: string;
    count: number;
  }[];
}

interface SocialHealthTabProps {
  userData: any;
  socialHealthData: SocialHealthData;
  accessToken: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const SENTIMENT_COLORS = ['#4CAF50', '#9E9E9E', '#F44336'];
const TOXICITY_COLORS = ['#F44336', '#FF9800', '#FFEB3B', '#4CAF50'];

export function SocialHealthTab({ userData, socialHealthData, accessToken }: SocialHealthTabProps) {
  const { data: likeAnalytics } = useGetLikeAnalyticsQuery({ 
    userId: userData.id,
    token: accessToken
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const categoryData = likeAnalytics?.labelAnalytics.map(item => ({
    name: item.label,
    value: item.count
  })) || [];

  const sentimentData = Object.entries(socialHealthData.interactionMetrics.sentiment).map(([name, value]) => ({
    name,
    value
  }));

  const toxicityData = Object.entries(socialHealthData.interactionMetrics.toxicity).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-6">
     

      {/* Content Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Content Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={likeAnalytics?.labelAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Interaction Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Interaction Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} likes`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>


      {/* Toxicity Metrics */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Toxicity Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={toxicityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {toxicityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TOXICITY_COLORS[index % TOXICITY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card> */}

     
    </div>
  );
} 