import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./components/LeftSideBar";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, setError, setUpdateProfile } from "./redux/slice/authSlice";
import toast, { Toaster } from "react-hot-toast";
import { useCheckAuth, useGetFollowerOrFollowing } from "./api/authApi";
import { setOnlineUsers } from "./redux/slice/chatSlice";
import { setSocketConnected } from "./redux/slice/socketSlice";
import {
  initializeSocket,
  connectSocket,
  disconnectSocket,
} from "./utils/socket";
import { useGetAllBookmark } from "./api/bookmarkApi";
import { getBookmarkPosts } from "./redux/slice/bookmarkSlice";

export default function App() {
  const dispatch = useDispatch();
  const { data: authData, error: authError } = useCheckAuth();
  const { user } = useSelector((state) => state.auth);

  const { data:bookmarkData } = useGetAllBookmark()

  const { data: FollowOrFollowing } = useGetFollowerOrFollowing()

  useEffect(() => {
    if (authData) {
      dispatch(checkAuth(authData.data));
      toast.success("Authenticated successfully", { id: "auth-success" });
    }
    if (authError) {
      dispatch(
        setError(authError.response?.data?.message || authError.message)
      );
    }
    if (bookmarkData?.data) {
      dispatch(getBookmarkPosts(bookmarkData.data));
    }

    if (FollowOrFollowing?.data) {
       const following = FollowOrFollowing.data.following?.map((user) => ({
        _id: user._id,
        username: user.username,
        profilePic: user.profilePic,
      })) || [];
      const followers = FollowOrFollowing.data.followers?.map((user) => ({
        _id: user._id,
        username: user.username,
        profilePic: user.profilePic,
      })) || [];
      dispatch(
        setUpdateProfile({
          ...user,
          followers,
          following,
        })
      );
    }
  }, [authData, authError, dispatch, FollowOrFollowing, bookmarkData]);

  // Manage socket connection
  useEffect(() => {
    if (user) {
      const socket = initializeSocket(`${import.meta.env.VITE_API_URL}`, user._id);
      connectSocket();

      socket.on("connect", () => {
        dispatch(setSocketConnected(true));
        console.log("Socket connected");
      });

      socket.on("disconnect", () => {
        dispatch(setSocketConnected(false));
        dispatch(setOnlineUsers([]));
        console.log("Socket disconnected");
      });

      socket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
        toast.error("Failed to connect to chat server");
      });

      return () => {
        disconnectSocket();
        dispatch(setSocketConnected(false));
      };
    }
  }, [user, dispatch]);

  return (
    <div className="flex min-h-screen bg-black">
      <LeftSideBar />
      <main className="flex-1 ml-24 lg:ml-72 px-6">
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        containerStyle={{ top: 20, right: 20 }}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#ffffff",
            borderRadius: "12px",
            padding: "16px 24px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          success: {
            style: {
              background: "#15803d",
              border: "1px solid rgba(22, 163, 74, 0.3)",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#15803d",
            },
          },
          error: {
            style: {
              background: "#b91c1c",
              border: "1px solid rgba(185, 28, 28, 0.3)",
            },
          },
        }}
      />
    </div>
  );
}
