import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PostsResponse, ReportsResponse } from "@/types/post";

interface StatsResponse {
  posts: number;
  reels: number;
  comments: number;
  users: number;
  reports?: {
    posts: number;
    reels: number;
    total: number;
  };
}

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/social`,
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<PostsResponse, { token: string; page?: number; limit?: number }>({
      query: ({ token, page = 1, limit = 100 }) => ({
        url: "/posts",
        params: {
          page,
          limit,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    getPostReports: builder.query<ReportsResponse, { postId: string; token: string }>({
      query: ({ postId, token }) => ({
        url: `/posts/${postId}/reports`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    approvePost: builder.mutation<void, { postId: string; token: string }>({
      query: ({ postId, token }) => ({
        url: `/posts/${postId}/approve`,
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    rejectPost: builder.mutation<void, { postId: string; token: string }>({
      query: ({ postId, token }) => ({
        url: `/posts/${postId}/reject`,
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    deletePost: builder.mutation<void, { postId: string; token: string }>({
      query: ({ postId, token }) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    getStats: builder.query<StatsResponse, string>({
      query: (token) => ({
        url: "/stats",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostReportsQuery,
  useApprovePostMutation,
  useRejectPostMutation,
  useDeletePostMutation,
  useGetStatsQuery,
} = postsApi; 