import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/` }),
  endpoints: (builder) => ({
    postSignup: builder.mutation({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, role: "user" }),
      }),
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "auth/verifyEmail",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      }),
    }),

    resendOtp: builder.mutation({
      query: (data) => ({
        url: "auth/resend-otp",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      }),
    }),
  }),
});

export const { usePostSignupMutation, useVerifyEmailMutation, useResendOtpMutation } = authApi;
export default authApi.reducer;
