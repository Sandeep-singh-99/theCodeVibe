import React from "react";
import NoChatSelected from "../components/NoChatSelected";
import SideBar from "../components/SideBar";

export default function Message() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] w-full max-w-7xl h-[calc(100vh-2rem)] rounded-2xl shadow-2xl overflow-hidden bg-base-100">
        {/* Sidebar */}
        <div className="hidden lg:block border-r border-base-300">
          <SideBar />
        </div>
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center h-full">
          <NoChatSelected />
        </div>
      </div>
    </div>
  );
}