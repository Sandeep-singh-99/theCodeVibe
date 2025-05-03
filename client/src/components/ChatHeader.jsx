import React from "react";
import { useSelector } from "react-redux";

export default function ChatHeader() {
  const { selectedUser } = useSelector((state) => state.auth);
  const { onlineUsers } = useSelector((state) => state.chat);
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/default-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="font-medium">{selectedUser.username}</h2>
            <p className="text-sm text-base-content/70">
            {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
