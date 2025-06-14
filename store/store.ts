import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { authApi } from "./services/authApi";
import { userApi } from "./services/userApi";
import { contentApi } from "./services/contentApi";
import { postsApi } from "./services/postsApi";
import { reportsApi } from "./services/reportsApi";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    userInfo: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      contentApi.middleware,
      postsApi.middleware,
      reportsApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
