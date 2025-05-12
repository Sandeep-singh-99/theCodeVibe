import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import postSlice from "./slice/postSlice";
import bookmarkSlice from "./slice/bookmarkSlice";
import chatSlice from "./slice/chatSlice";
import SocketSlice from "./slice/socketSlice";

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
};

const rootReducer = combineReducers({
  auth: authSlice,
  posts: postSlice,
  bookmark: bookmarkSlice,
  chat: chatSlice,
  socket: SocketSlice,
});

// const store = configureStore({
//   reducer: {
//     auth: authSlice,
//     posts: postSlice,
//     bookmark: bookmarkSlice,
//     chat: chatSlice,
//     socket: SocketSlice,
//   },
// });


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
