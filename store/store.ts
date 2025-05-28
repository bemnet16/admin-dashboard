import { configureStore } from "@reduxjs/toolkit";

import { opportunityApi } from "./services/opportunityApi";
import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { contentApi } from "./services/contentApi";
import userReducer from "./features/userSlice";
import bookmarkReducer from "./features/bookmarkSlice";
import opportunityReducer from "./features/opportunitySlice";

export const store = configureStore({
  reducer: {
    userInfo: userReducer,
    bookmarks: bookmarkReducer,
    opportunities: opportunityReducer,
    [opportunityApi.reducerPath]: opportunityApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      opportunityApi.middleware,
      authApi.middleware,
      userApi.middleware,
      contentApi.middleware,
    ),
});
