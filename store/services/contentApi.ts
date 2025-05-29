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

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3005",
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
  }),
});

export const {
  useGetContentsQuery,
  useGetContentByIdQuery,
  useGetContentReportsQuery,
} = contentApi; 