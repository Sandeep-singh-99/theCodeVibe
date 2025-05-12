import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
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

  const isUserChat = selectedUser != null;

  return (
    <div className="h-[650px] w-full flex flex-col overflow-hidden">
      <div className="flex-1 flex  my-5">
        <div className=" w-full h-full flex">
          <div className="flex h-full w-full overflow-hidden rounded-2xl">
            {/* Sidebar */}
            <div
              className={`${
                isSidebarOpen && !isUserChat
                  ? "w-full lg:w-96"
                  : isUserChat
                  ? "hidden lg:block lg:w-96"
                  : "hidden"
              } transition-all duration-300 ease-in-out border-r border-base-300`}
              aria-hidden={isUserChat && !isSidebarOpen ? "true" : "false"}
            >
              <SideBar />
            </div>

            {/* Chat Area */}
            <div
              className={`${
                isUserChat ? "w-full lg:flex-1" : "hidden lg:flex lg:flex-1"
              } flex flex-col transition-all duration-300 ease-in-out bg-base-100`}
            >
              {isUserChat && (
                <button
                  onClick={handleBack}
                  className="lg:hidden p-4 text-left font-medium flex items-center gap-2 bg-base-100 border-b border-base-300 hover:bg-base-200 transition-colors"
                  aria-label="Return to conversation list"
                >
                  <ChevronLeft size={24} />
                  Back
                </button>
              )}

              
              {isUserChat ? (
                <ChatContainer />
              ) : (
                <div className="flex w-full h-full justify-center items-center">
                  <NoChatSelected />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
