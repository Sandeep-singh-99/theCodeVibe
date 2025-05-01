import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSideBarUser } from "../api/sideBarApi";
import { setUsers } from "../redux/slice/chatSlice";
import { setSelectedUser } from "../redux/slice/authSlice";

const ConversationItem = ({ conv, isActive, onSelect }) => {
  const { onlineUsers } = useSelector((state) => state.chat);
  const isOnline = onlineUsers.includes(conv._id);
  const dispatch = useDispatch();

  return (
    <li
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-primary text-primary-content"
          : "hover:bg-base-200 text-base-content"
      }`}
      tabIndex={0}
      role="button"
      aria-label={`Select conversation with ${conv.username}`}
      aria-current={isActive ? "true" : "false"}
      onClick={() => {
        dispatch(setSelectedUser(conv));
        onSelect(conv._id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          dispatch(setSelectedUser(conv));
          onSelect(conv._id);
        }
      }}
    >
      <div className="relative flex items-center gap-3 w-full">
        <img
          src={conv.profilePic || "https://via.placeholder.com/40"}
          alt={`${conv.username}'s profile picture`}
          className="w-10 h-10 rounded-full object-cover border border-base-300"
        />
        {isOnline && (
          <span
            className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100 animate-pulse"
            aria-label={`${conv.username} is online`}
            title={`${conv.username} is online`}
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{conv.username}</h4>
          <span className="text-xs opacity-60">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </li>
  );
};

const SkeletonLoader = () => (
  <div className="p-3 space-y-3">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
        <div className="w-10 h-10 bg-base-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="w-3/5 h-4 bg-base-200 rounded" />
          <div className="w-1/3 h-3 bg-base-200 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export default function SideBar() {
  const { users, loading } = useSelector((state) => state.chat);
  const { selectedUser } = useSelector((state) => state.auth);
  const { data: chatUsers, isLoading } = useSideBarUser();
  const dispatch = useDispatch();
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (chatUsers) {
      dispatch(setUsers(chatUsers.data));
    }
  }, [chatUsers, dispatch]);

  useEffect(() => {
    if (selectedUser) {
      setActiveConversation(selectedUser._id);
    } else {
      setActiveConversation(null);
    }
  }, [selectedUser]);

  const handleSelectConversation = (id) => {
    setActiveConversation(id);
  };

  const filteredConversations =
    users?.filter((conv) =>
      conv.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <aside
      className="w-full lg:w-96 bg-base-100 flex flex-col h-full border-r border-base-300 transition-all duration-300"
      aria-label="Conversation sidebar"
    >
      {/* Header */}
      <div className="p-4 border-b border-base-300 bg-base-100 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-base-content">Chats</h3>
          <button
            className="btn btn-ghost btn-sm hover:bg-primary hover:text-primary-content transition-colors"
            aria-label="Start new conversation"
            onClick={() => alert("Open new conversation modal")}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/60" />
          <input
            type="text"
            placeholder="Search chats..."
            className="input input-sm w-full pl-10 bg-base-200 text-base-content placeholder-base-content/60 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Conversation List */}
      <ul className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading || loading ? (
          <SkeletonLoader />
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conv={conv}
              isActive={activeConversation === conv._id}
              onSelect={handleSelectConversation}
            />
          ))
        ) : (
          <p className="text-center text-base-content/60 p-4">
            {searchQuery
              ? "No matching conversations found."
              : "No conversations yet."}
          </p>
        )}
      </ul>
    </aside>
  );
}
