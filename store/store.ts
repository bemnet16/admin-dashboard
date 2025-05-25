import { configureStore } from "@reduxjs/toolkit";

import { opportunityApi } from "./services/opportunityApi";
import { authApi } from "./services/authApi";
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      opportunityApi.middleware,
      authApi.middleware
    ),
});
