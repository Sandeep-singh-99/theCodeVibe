import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        isLoading: false,
        isError: false,
        posts: [],
    },

    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        setError: (state, action) => {
            state.isError = action.payload;
        },

        setPosts: (state, action) => {
            state.posts = action.payload;
        },

        addPost: (state, action) => {
            state.posts.push(action.payload);
        },
    }
})

export const { setLoading, setError, setPosts, addPost } = postSlice.actions;

export default postSlice.reducer;