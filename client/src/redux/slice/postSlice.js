import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        isLoading: false,
        isError: false,
        posts: [],
        totalPosts: 0,
        postsUserId: [],
    },

    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        setError: (state, action) => {
            state.isError = action.payload;
        },

        setTotalPosts: (state, action) => {
            state.totalPosts = action.payload;
        },

        setPosts: (state, action) => {
            state.posts = action.payload;
        },

        setDeletePost: (state, action) => {
            state.posts = state.posts.filter((post) => post._id !== action.payload);
            state.postsUserId = state.postsUserId.filter((post) => post._id !== action.payload);
        },

        setPostsUserId: (state, action) => {
            state.postsUserId = action.payload;
        },

        addPost: (state, action) => {
            state.posts.push(action.payload);
        },
    }
})

export const { setLoading, setError, setPosts, addPost, setTotalPosts, setPostsUserId, setDeletePost } = postSlice.actions;

export default postSlice.reducer;