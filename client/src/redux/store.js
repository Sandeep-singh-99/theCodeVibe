import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import postSlice from "./slice/postSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postSlice,
    }
})

export default store;