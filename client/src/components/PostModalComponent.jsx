import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom"; 
import { ImageMinus, VideoOff, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useCreatePost } from "../api/postApi";

export default function PostModalComponent({ isOpen, onClose }) {
  const [postContent, setPostContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [postData, setPostData] = useState(null);
  const maxLength = 280;
  const maxFileSize = 50 * 1024 * 1024;

  const { user } = useSelector((state) => state.auth);
  const {
    mutate: createPost,
    isPending,
    isError,
    error,
    isSuccess,
  } = useCreatePost();

  const handlePost = () => {
    if (!postContent.trim() && !mediaFile) {
      alert("Please provide content or select an image/video.");
      return;
    }

    const formData = new FormData();
    if (postContent.trim()) {
      formData.append("content", postContent);
    }
    if (mediaFile) {
      const fieldName = mediaFile.type.startsWith("video/")
        ? "videos"
        : "images";
      formData.append(fieldName, mediaFile);
    }

    createPost(formData, {
      onSuccess: (data) => {
        setPostData(data.data);
        setPostContent("");
        setMediaFile(null);
        setMediaPreview(null);
        setTimeout(onClose, 2000);
      },
      onError: (error) => {
        console.error(
          "Error creating post:",
          error.response?.data,
          error.message
        );
      },
    });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, PNG, or MP4 files are allowed.");
        return;
      }
      if (file.size > maxFileSize) {
        alert("File is too large. Maximum size is 50MB.");
        return;
      }
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setPostContent("");
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
      setMediaFile(null);
      setMediaPreview(null);
      setPostData(null);
    }
  }, [isOpen, mediaPreview]);

  if (!isOpen) return null;

  return createPortal(
    <dialog
      id="post_modal"
      className="modal fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50"
      open={isOpen}
      onClick={handleOverlayClick}
      aria-labelledby="post_modal_title"
    >
      <div className="modal-box bg-base-300 shadow-2xl/100 shadow-gray-400 border border-gray-400 text-white w-full max-w-xl rounded-lg">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="text-white text-xl cursor-pointer"
          >
            <X />
          </button>
        </div>

        <div className="flex mt-4">
          <div className="flex-shrink-0">
            <img
              src={user?.profilePic}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover cursor-pointer hover:border-blue-600 transition-colors"
            />
          </div>

          <div className="flex-1 ml-3">
            <textarea
              className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none"
              placeholder="What's happening?"
              rows="5"
              maxLength={maxLength}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              aria-label="Post content"
            ></textarea>

            {mediaPreview && (
              <div className="mt-2">
                {mediaFile?.type.startsWith("video/") ? (
                  <video
                    src={mediaPreview}
                    controls
                    className="max-w-full h-auto rounded-md"
                    aria-label="Selected video preview"
                  />
                ) : (
                  <img
                    src={mediaPreview}
                    alt="Selected image preview"
                    className="max-w-full h-auto rounded-md"
                  />
                )}
                <button
                  className="text-red-500 text-sm mt-1 cursor-pointer"
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreview(null);
                  }}
                >
                  Remove
                </button>
              </div>
            )}

            {isPending && (
              <p className="text-gray-500 text-sm mt-2">Posting...</p>
            )}
            {isError && (
              <p className="text-red-500 text-sm mt-2">
                {error?.response?.data?.error || "Failed to create post."}
              </p>
            )}
            {isSuccess && (
              <div className="text-green-500 text-sm mt-2">
                <p>Post created successfully!</p>
                {postData?.imagePic?.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Image {index + 1}
                  </a>
                ))}
                {postData?.videos?.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Video {index + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 border-t border-gray-700 pt-2">
          <div className="flex space-x-3">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleMediaChange}
                aria-label="Upload image"
              />
              <ImageMinus className="text-blue-400" />
            </label>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="video/mp4"
                className="hidden"
                onChange={handleMediaChange}
                aria-label="Upload video"
              />
              <VideoOff className="text-blue-400" />
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {postContent.length}/{maxLength}
            </span>
            <button
              className="btn bg-gray-600 text-white rounded-full px-4 py-1 disabled:opacity-50"
              onClick={handlePost}
              disabled={(!postContent.trim() && !mediaFile) || isPending}
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </dialog>,
    document.body 
  );
}
