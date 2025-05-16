import React, { useState } from "react";
import { ChevronLeft, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "../redux/slice/authSlice";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

export default function Message() {
  const { selectedUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleBack = () => {
    setIsSidebarOpen(true);
    dispatch(setSelectedUser(null));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const isUserChat = selectedUser != null;

  return (
    <div className="h-[calc(100vh-2rem)] w-full flex flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-900 rounded-2xl shadow-lg m-2">
      <div className="flex-1 flex">
        <div className="w-full h-full flex">
          <div className="flex h-full w-full overflow-hidden">
            {/* Sidebar */}
            <div
              className={`
                ${isSidebarOpen && !isUserChat ? "w-full lg:w-96" : isUserChat ? "hidden lg:block lg:w-96" : "hidden"}
                h-full border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              `}
              aria-hidden={isUserChat && !isSidebarOpen}
              role="region"
              aria-label="Conversation list"
            >
              <SideBar />
            </div>

            {/* Chat Area */}
            <div
              className={`
                ${isUserChat ? "w-full lg:flex-1" : "hidden lg:flex lg:flex-1"}
                flex flex-col bg-neutral-50 dark:bg-neutral-900 transition-opacity duration-300 ease-in-out
                ${isUserChat ? "opacity-100" : "opacity-70"}
              `}
              role="main"
              aria-label="Chat area"
            >
              {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                {isUserChat ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    aria-label="Return to conversation list"
                  >
                    <ChevronLeft size={24} />
                    <span className="text-sm font-medium">Back</span>
                  </button>
                ) : (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
                    aria-label="Toggle sidebar"
                  >
                    <Menu size={24} />
                  </button>
                )}
                {isUserChat && (
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {selectedUser?.name || "Chat"}
                  </h2>
                )}
              </div>

              {/* Chat Content */}
              <div className="flex-1 flex flex-col overflow-y-auto pt-4 lg:pt-0">
                {isUserChat ? (
                  <ChatContainer />
                ) : (
                  <div className="flex w-full h-full justify-center items-center p-4">
                    <NoChatSelected />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}