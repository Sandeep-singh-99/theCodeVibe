import { createSlice } from "@reduxjs/toolkit";

const trendingSlice = createSlice({
    name: "trending",
    initialState: {
        trendingPosts: [],
        loading: false,
        error: null,
    },
    
    reducers: {
        setTrendingPosts: (state, action) => {
            state.trendingPosts = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
})

export const { setTrendingPosts, setLoading, setError } = trendingSlice.actions;

export default trendingSlice.reducer;