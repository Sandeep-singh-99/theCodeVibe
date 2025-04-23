import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./components/LeftSideBar";
import { useDispatch } from "react-redux";
import { checkAuth, setError } from "./redux/slice/authSlice";
import toast, { Toaster } from "react-hot-toast";
import { useCheckAuth } from "./api/authApi";

export default function App() {
  const dispatch = useDispatch();
  const { data: authData, error: authError } = useCheckAuth();

  useEffect(() => {
    if (authData) {
      dispatch(checkAuth(authData.data));
      toast.success("Authenticated successfully", { id: "auth-success" });
    }
    if (authError) {
      dispatch(setError(authError.response?.data?.message || authError.message));
    }
  }, [authData, authError, dispatch]);

  return (
    <div className="flex min-h-screen">
      <LeftSideBar />
      <main className="flex-1 ml-24 lg:ml-72 p-6">
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