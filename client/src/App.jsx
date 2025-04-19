import React from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./components/LeftSideBar";

export default function App() {
  return (
    <div className="flex min-h-screen">
      <LeftSideBar />
      <main className="flex-1 ml-24 lg:ml-72 p-6">
        <Outlet />
      </main>
    </div>
  );
}