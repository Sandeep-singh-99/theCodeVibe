import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import postSlice from "./slice/postSlice"
import bookmarkSlice from "./slice/bookmarkSlice";
import chatSlice from "./slice/chatSlice";
import SocketSlice  from "./slice/socketSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postSlice,
        bookmark: bookmarkSlice,
        chat: chatSlice,
        socket: SocketSlice
    }
})

export default store;