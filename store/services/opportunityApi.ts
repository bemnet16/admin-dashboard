import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const opportunityApi = createApi({
  reducerPath: "opportunityApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://akil-backend.onrender.com/" }),
  endpoints: (builder) => ({
    getOpportunities: builder.query({
      query: () => "opportunities/search",
    }),
    getOpportunityById: builder.query({
      query: (id) => `opportunities/${id}`,
    }),
  }),
});

export const { useGetOpportunitiesQuery, useGetOpportunityByIdQuery } =
  opportunityApi;
