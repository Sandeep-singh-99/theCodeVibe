import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Image, Send, X, Loader2, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useChatMessage } from "../api/chatApi";
import { useSelector } from "react-redux";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const imageInputRef = useRef(null);
  const { selectedUser } = useSelector((state) => state.auth);

  const SendMessageMutation = useChatMessage(selectedUser._id);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage || !selectedImage.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }

    setImage(selectedImage);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview({ type: "image", url: reader.result });
    };
    reader.readAsDataURL(selectedImage);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append("text", text.trim());
      if (image) formData.append("image", image);

      if (!formData.has("text") && !formData.has("image")) {
        throw new Error("No valid data to send");
      }

      await SendMessageMutation.mutateAsync(formData);
      setText("");
      setImage(null);
      setImagePreview(null);
      setShowEmojiPicker(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
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
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview.url}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
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
            ref={imageInputRef}
            onChange={handleImageChange}
            accept="image/*"
            disabled={isUploading}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500"
            onClick={() => imageInputRef.current?.click()}
            disabled={isUploading}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle relative"
          disabled={isUploading}
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
