import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import postSlice from "./slice/postSlice"
import bookmarkSlice from "./slice/bookmarkSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postSlice,
        bookmark: bookmarkSlice
    }
})

export default store;