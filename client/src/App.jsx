import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./components/LeftSideBar";
import { useDispatch } from "react-redux";
import { isCheckAuth } from "./redux/slice/authSlice";

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(isCheckAuth())
  },[dispatch])
  return (
    <div className="flex min-h-screen">
      <LeftSideBar />
      <main className="flex-1 ml-24 lg:ml-72 p-6">
        <Outlet />
      </main>
    </div>
  );
}