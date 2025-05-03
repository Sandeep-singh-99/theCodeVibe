import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Image, Send, X, FileText, Loader2, Smile, Video } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useChatMessage } from "../api/chatApi";
import { useSelector } from "react-redux";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { selectedUser } = useSelector((state) => state.auth);


  const SendMessageMutation = useChatMessage(selectedUser._id);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview({
        type: selectedFile.type.startsWith("image/")
          ? "image"
          : selectedFile.type.startsWith("video/")
          ? "video"
          : "file",
        url: reader.result,
        name: selectedFile.name,
      });
    };
    if (
      selectedFile.type.startsWith("image/") ||
      selectedFile.type.startsWith("video/")
    ) {
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview({ type: "file", url: null, name: selectedFile.name });
    }
  };

  const removeFile = () => {
    setFilePreview(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append("text", text.trim());
      if (file) {
        if (file.type.startsWith("image/")) formData.append("image", file);
        else if (file.type.startsWith("video/")) formData.append("video", file);
        else formData.append("file", file);
      }

      if (
        !formData.has("text") &&
        !formData.has("image") &&
        !formData.has("video") &&
        !formData.has("file")
      ) {
        throw new Error("No valid data to send");
      }

      await SendMessageMutation.mutateAsync(formData);
      setText("");
      setFile(null);
      setFilePreview(null);
      setShowEmojiPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onEmojiClick = (emojiObject) =>
    setText((prev) => prev + emojiObject.emoji);

  return (
    <div className="p-4 w-full">
      {filePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {filePreview.type === "image" ? (
              <img
                src={filePreview.url}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            ) : filePreview.type === "video" ? (
              <video
                src={filePreview.url}
                controls
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            ) : (
              <div className="w-20 h-20 flex flex-col items-center justify-center rounded-lg border border-zinc-700 bg-gray-800">
                <FileText size={32} className="text-zinc-400" />
                <span className="text-xs text-zinc-400 mt-1 truncate w-full text-center">
                  {filePreview.name}
                </span>
              </div>
            )}
            <button
              onClick={removeFile}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              disabled={isUploading}
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 relative"
      >
        <div className="flex-1 flex gap-2 relative">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md pr-20"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isUploading}
          />
          <button
            type="button"
            className="absolute right-12 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={isUploading}
          >
            <Smile size={20} />
          </button>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*,application/pdf"
            disabled={isUploading}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle relative"
          disabled={(!text.trim() && !file) || isUploading}
        >
          {isUploading ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <Send size={22} />
          )}
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-0 z-10">
            <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
          </div>
        )}
      </form>
    </div>
  );
}