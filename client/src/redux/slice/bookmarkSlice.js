import { createSlice } from '@reduxjs/toolkit';

const bookmarkSlice = createSlice({
    name: 'bookmark',
    initialState: {
        bookmarkPosts: [],
        isLoading: false,
        isError: false
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
    },
})

export const { getBookmarkPosts, setLoading, setError } = bookmarkSlice.actions;

export default bookmarkSlice.reducer;