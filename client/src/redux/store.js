import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import postSlice from "./slice/postSlice";
import bookmarkSlice from "./slice/bookmarkSlice";
import chatSlice from "./slice/chatSlice";
import SocketSlice from "./slice/socketSlice";
import commentSlice from "./slice/commentSlice"
import trendingSlice from "./slice/trendingSlice"

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["comment"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  posts: postSlice,
  bookmark: bookmarkSlice,
  chat: chatSlice,
  socket: SocketSlice,
  comment: commentSlice,
  trending: trendingSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});


export default store;
