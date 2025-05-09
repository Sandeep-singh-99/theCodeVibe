import { createSlice } from "@reduxjs/toolkit";

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: {
    bookmarkPosts: [],
    isLoading: false,
    isError: false,
  },

  reducers: {
    getBookmarkPosts: (state, action) => {
      state.bookmarkPosts = action.payload.slice().reverse();
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.isError = action.payload;
    },
    setBookmarkPosts: (state, action) => {
      const newPost = {
        ...action.payload,
        userId: {
          _id: action.payload.userId || "", 
          username: action.payload.userId?.username || "Unknown User", 
          email: action.payload.userId?.email || "", 
          profilePic: action.payload.userId?.profilePic || "https://via.placeholder.com/48", 
        },
      };

      state.bookmarkPosts = [newPost, ...state.bookmarkPosts];
    },
    setDeleteBookmark: (state, action) => {
      state.bookmarkPosts = action.payload.filter((bookmark) => bookmark._id !== action.payload);
    },
  },
});

export const { getBookmarkPosts, setLoading, setError, setBookmarkPosts, setDeleteBookmark } = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
