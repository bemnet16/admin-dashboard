import { createSlice } from "@reduxjs/toolkit";

export const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState: {
    bookmarks: [] as string[],
  },
  reducers: {
    setBookmarks: (state, action) => {
      state.bookmarks = action.payload;
    },
    addBookmark: (state, action) => {
      if (!state.bookmarks.includes(action.payload)) {
        state.bookmarks.push(action.payload);
      }
    },
    removeBookmark: (state, action) => {
      state.bookmarks = state.bookmarks.filter(
        (bookmark) => bookmark !== action.payload
      );
    },
  },
});

export const { setBookmarks, addBookmark, removeBookmark } =
  bookmarkSlice.actions;

export default bookmarkSlice.reducer;
