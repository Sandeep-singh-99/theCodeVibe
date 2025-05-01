import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSideBarUser } from "../api/sideBarApi";
import { setUsers } from "../redux/slice/chatSlice";

const ConversationItem = ({ conv, isActive, onSelect }) => {
  const { onlineUsers } = useSelector((state) => state.chat);
  const isOnline = onlineUsers.includes(conv._id);

  return (
    <li
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"
      }`}
      tabIndex={0}
      role="button"
      aria-label={`Select conversation with ${conv.username}`}
      aria-current={isActive ? "true" : "false"}
      onClick={() => onSelect(conv.id)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(conv.id)}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex items-center gap-2">
          <img
            src={conv.profilePic || "https://via.placeholder.com/40"}
            alt={`${conv.username}'s profile picture`}
            className="w-10 h-10 rounded-full object-cover"
          />
          {/* Online Status Indicator */}
          {isOnline && (
            <span
              className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100"
              aria-label={`${conv.username} is online`}
              title={`${conv.username} is online`}
            />
          )}
          <h4 className="font-medium text-base-content">{conv.username}
          <span className="text-sm opacity-60 ml-2">
                {isOnline ? "(Online)" : "(Offline)"}
              </span>
          </h4>
        </div>
      </div>
    </li>
  );
};

const SkeletonLoader = () => (
  <div className="p-3">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
        <div className="w-10 h-10 bg-base-200 rounded-full" />
        <div className="w-3/4 h-4 bg-base-200 rounded" />
      </div>
    ))}
  </div>
);

export default function SideBar() {
  const { users, loading } = useSelector((state) => state.chat);
  const { data: chatUsers, isLoading } = useSideBarUser();
  const dispatch = useDispatch();
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    if (chatUsers) {
      dispatch(setUsers(chatUsers.data));
    }
  }, [chatUsers, dispatch]);

  const handleSelectConversation = (id) => {
    setActiveConversation(id);
  };

  const conversations = users || [];

  return (
    <aside
      className="w-full lg:w-80 bg-base-100 flex flex-col h-full shadow-lg rounded-lg"
      aria-label="Conversation sidebar"
    >
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-base-content">Chats</h3>
        <button
          className="btn btn-ghost btn-sm hover:bg-primary hover:text-primary-content transition-colors"
          aria-label="Start new conversation"
          onClick={() => alert("Open new conversation modal")}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Conversation List */}
      <ul className="flex-1 overflow-auto p-2">
        {isLoading || loading ? (
          <SkeletonLoader />
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conv={conv}
              isActive={activeConversation === conv.id}
              onSelect={handleSelectConversation}
            />
          ))
        ) : (
          <p className="text-center text-base-content/60 p-4">
            No conversations yet.
          </p>
        )}
      </ul>
    </aside>
  );
}


