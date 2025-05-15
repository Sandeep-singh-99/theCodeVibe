import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        isLoading: false,
        isError: false,
        posts: [],
        totalPosts: 0,
        postsUserId: [],
        postById: null,
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

        setPostById: (state, action) => {
            state.postById = action.payload;
        },

        addPost: (state, action) => {
            const newPost = {
                ...action.payload,
                userId: {
                  _id: action.payload.userId,
                  username: state.posts[0]?.userId?.username || "Unknown User", 
                  email: state.posts[0]?.userId?.email || "",
                  profilePic:
                    state.posts[0]?.userId?.profilePic ||
                    "https://via.placeholder.com/48",
                },
              };
              state.posts = [newPost, ...state.posts];
              state.postsUserId = [newPost, ...state.postsUserId];
        },
        clearPostUserId: (state) => {
            state.postsUserId = [];
        }
    }
})

export const { setLoading, setError, setPosts, addPost, setTotalPosts, setPostsUserId, setDeletePost, setPostById, clearPostUserId } = postSlice.actions;

export default postSlice.reducer;