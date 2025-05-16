import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useGetChatMessages } from "../api/chatApi";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatMessageTime } from "../utils/formateTime";

export default function ChatContainer() {
  const { selectedUser } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  const {
    data: messages,
    isLoading,
    error,
  } = useGetChatMessages(selectedUser?._id);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast.error(`Failed to load messages: ${error.message}`);
    }
  }, [error]);

  const renderMessage = (message) => {
    const isSender = message.senderId === user?._id;

    return (
      <div
        className={`chat ${
          isSender ? "chat-end" : "chat-start"
        } group relative`}
      >
        <div className="chat-image avatar">
          <div className="size-10 rounded-full border">
            <img
              src={
                isSender
                  ? user.profilePic || "/avatar.png"
                  : selectedUser.profilePic || "/avatar.png"
              }
              alt="profile pic"
            />
          </div>
        </div>
        <div className="chat-header mb-1">
          <time className="text-xs opacity-50 ml-1">
            {formatMessageTime(message.createdAt)}
          </time>
        </div>
        <div className="chat-bubble flex flex-col relative">
          {message.images?.length > 0 && message.images[0] && (
            <div className="relative">
              <img
                src={message.images[0]}
                alt="Attachment"
                className="sm:max-w-[200px] rounded-md mb-2"
              />
            </div>
          )}
          {message.text && (
            <p className="break-words whitespace-pre-wrap overflow-hidden text-ellipsis">
              {message.text}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader />
      <div
        className="flex-1 max-h-[calc(95vh-140px)] overflow-y-auto p-4 space-y-4 custom-scrollbar"
        role="log"
        aria-label="Chat messages"
      >
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin" size={32} />
          </div>
        )}
        {!isLoading && !selectedUser && (
          <div className="flex justify-center items-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
        {!isLoading && messages?.length === 0 && selectedUser && (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}
        {!isLoading && messages?.map((message) => renderMessage(message))}
        <div ref={messagesEndRef} />
      </div>
      {selectedUser && <MessageInput />}
    </div>
  );
}