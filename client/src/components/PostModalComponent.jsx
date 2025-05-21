import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ImageMinus, VideoOff, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useCreatePost } from "../api/postApi";
import { addPost } from "../redux/slice/postSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function PostModalComponent({ isOpen, onClose }) {
  const [postContent, setPostContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]); 
  const [mediaPreviews, setMediaPreviews] = useState([]); 
  const [postData, setPostData] = useState(null);
  const maxFileSize = 50 * 1024 * 1024; 

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    mutate: createPost,
    isPending,
    isError,
    error,
    isSuccess,
  } = useCreatePost();

  const handlePost = () => {
    const strippedContent = postContent.replace(/<(.|\n)*?>/g, "").trim();
    if (!strippedContent && mediaFiles.length === 0) {
      alert("Please add some content or media to share.");
      return;
    }

    const formData = new FormData();
    if (strippedContent) {
      formData.append("content", postContent);
    }
    mediaFiles.forEach((file) => {
      const fieldName = file.type.startsWith("video/") ? "videos" : "images";
      formData.append(fieldName, file);
    });

    createPost(formData, {
      onSuccess: (data) => {
        setPostData(data.data);
        dispatch(addPost(data.data));
        setPostContent("");
        setMediaFiles([]);
        setMediaPreviews([]);
        setTimeout(onClose, 1500);
      },
      onError: (error) => {
        console.error("Error creating post:", error.response?.data || error.message);
      },
    });
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files); 
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a valid type. Only JPEG, PNG, or MP4 allowed.`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds 50MB limit.`);
        return false;
      }
      return true;
    });

    
    const totalImages = validFiles.filter((file) => file.type.startsWith("image/")).length;
    const totalVideos = validFiles.filter((file) => file.type.startsWith("video/")).length;
    if (totalImages > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }
    if (totalVideos > 5) {
      alert("You can upload a maximum of 5 videos.");
      return;
    }

    setMediaFiles(validFiles);
    setMediaPreviews(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setPostContent("");
      mediaPreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setMediaFiles([]);
      setMediaPreviews([]);
      setPostData(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <dialog
      id="post_modal"
      className="fixed modal inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      open={isOpen}
      onClick={handleOverlayClick}
    >
      <div className="modal-box bg-white shadow-2xl/100 shadow-gray-400 border border-gray-400 text-white w-full max-w-2xl rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Create a post</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-start gap-3">
          <img
            src={user?.profilePic || "/default-avatar.png"}
            alt="User avatar"
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
          <div className="flex-1">
            <ReactQuill
              value={postContent}
              onChange={setPostContent}
              theme="snow"
              placeholder="What's on your mind?"
              className="border-none text-gray-900"
              style={{ minHeight: "120px" }}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline"],
                  ["blockquote", "code-block"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                ],
              }}
              formats={{
                header: ["header"],
                bold: ["bold"],
                italic: ["italic"],
                underline: ["underline"],
                blockquote: ["blockquote"],
                "code-block": ["code-block"],
                list: ["list"],
                link: ["link"],
                ordered: ["ordered"],
                bullet: ["bullet"],
              }}
            />
          </div>
        </div>

        {/* Media Preview - DaisyUI Carousel */}
        {mediaPreviews.length > 0 && (
          <div className="mt-4 relative">
            <div className="carousel w-full max-h-96 rounded-lg">
              {mediaPreviews.map((preview, index) => (
                <div
                  key={index}
                  id={`slide-${index}`}
                  className="carousel-item relative w-full"
                >
                  {mediaFiles[index]?.type.startsWith("video/") ? (
                    <video
                      src={preview}
                      controls
                      className="w-full max-h-96 object-contain bg-gray-100"
                    />
                  ) : (
                    <img
                      src={preview}
                      alt={`Media preview ${index + 1}`}
                      className="w-full max-h-96 object-contain bg-gray-100"
                    />
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    aria-label="Remove media"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {/* Carousel Navigation */}
            {mediaPreviews.length > 1 && (
              <div className="flex justify-center w-full py-2 gap-2">
                {mediaPreviews.map((_, index) => (
                  <a
                    key={index}
                    href={`#slide-${index}`}
                    className="btn btn-xs btn-circle"
                  >
                    {index + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Status Messages */}
        {isPending && <p className="text-sm text-gray-500 mt-3">Sharing your post...</p>}
        {isError && (
          <p className="text-sm text-red-500 mt-3">
            {error?.response?.data?.error || "Something went wrong. Please try again."}
          </p>
        )}
        {isSuccess && (
          <p className="text-sm text-green-500 mt-3">Post shared successfully!</p>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex gap-3">
            <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleMediaChange}
                multiple 
              />
              <ImageMinus className="w-5 h-5 font-semibold text-black" />
            </label>
            <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
              <input
                type="file"
                accept="video/mp4"
                className="hidden"
                onChange={handleMediaChange}
                multiple 
              />
              <VideoOff className="w-5 h-5 font-semibold text-black" />
            </label>
          </div>
          <div>
            <button
              onClick={handlePost}
              disabled={(!postContent.replace(/<(.|\n)*?>/g, "").trim() && mediaFiles.length === 0) || isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      </div>
    </dialog>,
    document.body
  );
}