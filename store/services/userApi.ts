import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the User type based on your backend response
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  picture: string;
  bio: string;
  profilePic: string;
  following: string[];
  followers: string[];
  gender: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/auth` }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: (token) => ({
        url: "/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUserStatus: builder.mutation<User, { userId: string; status: 'active' | 'suspended'; token: string }>({
      query: ({ userId, status, token }) => ({
        url: `/updateprofile`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { userId, status },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, { userId: string; token: string }>({
      query: ({ userId, token }) => ({
        url: `/users/${userId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useGetUserByIdQuery, 
  useUpdateUserStatusMutation,
  useDeleteUserMutation 
} = userApi; 