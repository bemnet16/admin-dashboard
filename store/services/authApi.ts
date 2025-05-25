import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://akil-backend.onrender.com/" }),
  endpoints: (builder) => ({
    postSignup: builder.mutation({
      query: (data) => ({
        url: "signup",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, role: "user" }),
      }),
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "verify-email",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      }),
    }),
  }),
});

export const { usePostSignupMutation, useVerifyEmailMutation } = authApi;
export default authApi.reducer;
