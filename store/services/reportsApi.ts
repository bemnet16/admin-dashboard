import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ReportsResponse } from "@/types/post";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/social`,
  }),
  endpoints: (builder) => ({
    getReports: builder.query<ReportsResponse, { token: string }>({
      query: ({ token }) => ({
        url: "/reports",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useGetReportsQuery } = reportsApi; 