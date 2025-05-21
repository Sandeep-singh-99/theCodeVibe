import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  Share2,
  FileText,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDeletePost } from "../api/postApi";
import { setDeletePost } from "../redux/slice/postSlice";
import { useState } from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import ReactPlayer from "react-player";

const PostContentComponent = () => {
  const { postsUserId, isLoading, isError } = useSelector(
    (state) => state.posts
  );
  const dispatch = useDispatch();
  const { mutate: deletePost } = useDeletePost();

  const [expandedPosts, setExpandedPosts] = useState({});
  const [isDeleteLoading, setIsDeleteLoading] = useState(null);
  const [slideIndices, setSlideIndices] = useState({}); 

  const handleDelete = (postId) => {
    setIsDeleteLoading(postId);
    deletePost(postId, {
      onSuccess: () => {
        dispatch(setDeletePost(postId));
        setIsDeleteLoading(null);
        setSlideIndices((prev) => {
          const newIndices = { ...prev };
          delete newIndices[postId];
          return newIndices;
        });
      },
      onError: (error) => {
        console.error("Delete post error:", error);
        setIsDeleteLoading(null);
      },
    });
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handlePrevSlide = (postId, totalSlides) => {
    setSlideIndices((prev) => {
      const newIndex = (prev[postId] || 0) === 0 ? totalSlides - 1 : (prev[postId] || 0) - 1;
      console.log(`Prev slide for post ${postId}: ${newIndex}`);
      return { ...prev, [postId]: newIndex };
    });
  };

  const handleNextSlide = (postId, totalSlides) => {
    setSlideIndices((prev) => {
      const newIndex = (prev[postId] || 0) === totalSlides - 1 ? 0 : (prev[postId] || 0) + 1;
      console.log(`Next slide for post ${postId}: ${newIndex}`);
      return { ...prev, [postId]: newIndex };
    });
  };

  const customParser = (html) => {
    if (typeof html !== "string") {
      console.warn("Invalid HTML content:", html);
      return null;
    }
    const sanitizedHtml = DOMPurify.sanitize(html);
    return parse(sanitizedHtml, {
      replace: (domNode) => {
        if (domNode.name === "iframe") {
          return (
            <iframe
              src={domNode.attribs.src}
              width="100%"
              height="400"
              title="Iframe Content"
              frameBorder="0"
            />
          );
        }
        if (domNode.name === "script") {
          return null;
        }
        return null;
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="loading loading-spinner loading-lg text-primary animate-pulse"></div>
        <p className="mt-2 text-gray-600 font-medium">Loading posts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-medium">
          Failed to load posts. Please try again later.
        </p>
        <button
          className="mt-4 btn btn-sm btn-outline btn-error"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!postsUserId || postsUserId.length === 0) {
    return (
      <div className="p-6 text-center">
        <FileText
          className="mx-auto h-12 w-12 text-gray-400"
          aria-hidden="true"
        />
        <p className="mt-2 text-gray-500 font-medium">No posts available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">
        Posts
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {postsUserId.map((post) => {
          const isExpanded = expandedPosts[post._id];
          const isLongPost =
            typeof post.content === "string" && post.content.length > 150;
          const displayContent =
            isLongPost && !isExpanded
              ? `${post.content.slice(0, 150)}...`
              : post.content;
          const mediaItems = [...(post.imagePic || []), ...(post.videos || [])];
          const totalSlides = mediaItems.length;
          const currentSlide = slideIndices[post._id] || 0;


          if (!post.content) {
            console.warn(
              `Post with ID ${post._id} has undefined content`,
              post
            );
          }

          return (
            <div
              key={post._id}
              className="bg-base-300 border border-base-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[400px] flex flex-col"
              role="article"
              aria-labelledby={`post-title-${post._id}`}
            >
              {/* Post Header: User Info */}
              <div className="flex items-center justify-between p-4 border-b border-base-100">
                <div className="flex items-center">
                  <div className="avatar mr-3">
                    <div className="w-10 sm:w-12 rounded-full ring-2 ring-primary ring-offset-2">
                      <img
                        src={
                          post.userId?.profilePic ||
                          "https://via.placeholder.com/48"
                        }
                        alt={`${post.userId?.username || "User"}'s profile`}
                        className="rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4
                      id={`post-title-${post._id}`}
                      className="text-base sm:text-lg font-semibold text-white"
                    >
                      {post.userId?.username || "Unknown User"}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="dropdown dropdown-end">
                  <button
                    tabIndex={0}
                    className="btn btn-ghost btn-circle"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <button
                        className="btn btn-sm btn-error text-white"
                        onClick={() => handleDelete(post._id)}
                        disabled={isDeleteLoading === post._id}
                        aria-label={`Delete post by ${
                          post.userId?.username || "user"
                        }`}
                      >
                        {isDeleteLoading === post._id ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Post Content */}
              <div className="p-4 flex-1">
                <div className="prose prose-xs max-w-none mb-4">
                  {customParser(displayContent)}
                </div>
                {isLongPost && (
                  <button
                    className="text-primary text-sm font-medium mt-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={() => toggleReadMore(post._id)}
                    aria-label={isExpanded ? "Show less" : "Read more"}
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
                {/* Post Media: DaisyUI Carousel */}
                {mediaItems.length > 0 ? (
                  <div className="mt-4 relative">
                    <div className="carousel w-full h-48 sm:h-64 rounded-lg overflow-hidden bg-gray-50">
                      {mediaItems.map((media, index) => (
                        <div
                          key={`${post._id}-media-${index}`}
                          id={`slide-${post._id}-${index}`}
                          className={`carousel-item w-full relative ${
                            index === currentSlide ? "block" : "hidden"
                          }`}
                        >
                          {media.includes("video") || media.endsWith(".mp4") ? (
                            <ReactPlayer
                              url={media}
                              controls
                              width="100%"
                              height="100%"
                              playing={index === currentSlide}
                              onError={(e) => console.error(`Video error for ${media}:`, e)}
                              config={{
                                youtube: { playerVars: { showinfo: 1 } },
                                file: { attributes: { controlsList: "nodownload" } },
                              }}
                            />
                          ) : (
                            <img
                              src={media}
                              alt={`Post media ${index + 1}`}
                              className="w-full h-48 sm:h-64 object-cover rounded-lg"
                              loading="lazy"
                              onError={(e) => {
                                console.error(`Image failed to load: ${media}`);
                                e.target.src = "https://via.placeholder.com/400";
                              }}
                            />
                          )}
                          <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                            {index + 1}/{totalSlides}
                          </div>
                        </div>
                      ))}
                    </div>
                    {totalSlides > 1 && (
                      <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-2">
                        <button
                          onClick={() => handlePrevSlide(post._id, totalSlides)}
                          className="btn btn-circle btn-sm bg-gray-800 text-white hover:bg-gray-700"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleNextSlide(post._id, totalSlides)}
                          className="btn btn-circle btn-sm bg-gray-800 text-white hover:bg-gray-700"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 text-gray-500 text-sm">
                    No media available
                  </div>
                )}
              </div>
              {/* Post Actions */}
              <div className="flex justify-between p-4 border-t border-base-200">
                <button
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  aria-label="Like post"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes?.length || 0}</span>
                  <span>Like</span>
                </button>
                <button
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Comment on post"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </button>
                <button
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                  aria-label="Share post"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostContentComponent;