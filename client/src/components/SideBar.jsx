import React from "react";
import { MessageSquare, Plus } from "lucide-react";

export default function SideBar() {
  const conversations = [
    { id: 1, title: "John Doe", lastMessage: "Hey, how's it going?" },
    { id: 2, title: "Jane Smith", lastMessage: "Let's meet tomorrow!" },
  ];

  return (
    <aside
      className="w-full lg:w-80 bg-base-100 flex flex-col h-full"
      aria-label="Conversation sidebar"
    >
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-base-content">Chats</h3>
        <button
          className="btn btn-ghost btn-sm"
          aria-label="Start new conversation"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Conversation List */}
      <ul className="flex-1 overflow-auto p-2">
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className="p-3 rounded-lg hover:bg-base-200 cursor-pointer transition-colors"
            tabIndex={0}
            role="button"
            aria-label={`Select conversation with ${conv.title}`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-base-content/60" />
              <div>
                <h4 className="font-medium text-base-content">{conv.title}</h4>
                <p className="text-sm text-base-content/60 truncate">
                  {conv.lastMessage}
                </p>
              </div>
            </div>
          </li>
        ))}
        {conversations.length === 0 && (
          <p className="text-center text-base-content/60 p-4">
            No conversations yet.
          </p>
        )}
      </ul>
    </aside>
  );
}