import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ContentItem } from "@/types/content";

interface ContentResponse {
  data: ContentItem[];
  total: number;
  page: number;
  limit: number;
}

interface Report {
  id: string;
  reasonDetails: {
    mainReason: string;
    subReason: string | null;
    details: string;
  };
  reporterId: string;
  reportedEntityType: string;
  reportedEntityId: string;
  status: string;
  resolutionDetails: string | null;
  resolutionDate: string | null;
  resolverId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ReportsResponse {
  data: Report[];
  total: number;
}

interface LikeAnalytics {
  totalReels: number;
  labelAnalytics: {
    label: string;
    count: number;
    percentage: number;
  }[];
}

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  tagTypes: ["Content"],
  endpoints: (builder) => ({
    getContents: builder.query<ContentItem[], { page: number; limit: number; token?: string }>({
      query: ({ page, limit, token }) => ({
        url: `/reel/many?page=${page}&limit=${limit}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      transformResponse: (response: ContentItem[]) => response,
      providesTags: ["Content"],
    }),
    getContentById: builder.query<ContentItem, { id: string; token?: string }>({
      query: ({ id, token }) => ({
        url: `/reel/${id}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      providesTags: (result, error, id) => [{ type: "Content", id: id.id }],
    }),
    getContentReports: builder.query<ReportsResponse, { contentId: string; token?: string }>({
      query: ({ contentId, token }) => ({
        url: `/reel/report?reportedEntityType=reel&reportedEntityId=${contentId}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      transformResponse: (response: Report[]) => ({
        data: response,
        total: response.length
      }),
    }),
    getLikeAnalytics: builder.query<LikeAnalytics, { userId: string; token: string }>({
      query: ({ userId, token }) => ({
        url: `/reel/analytics/liked?userId=${userId}`,
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    deleteContent: builder.mutation<void, { id: string; token: string }>({
      query: ({ id, token }) => ({
        url: `/reel/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Content"],
    }),
  }),
});

export const {
  useGetContentsQuery,
  useGetContentByIdQuery,
  useGetContentReportsQuery,
  useGetLikeAnalyticsQuery,
  useDeleteContentMutation,
} = contentApi; 