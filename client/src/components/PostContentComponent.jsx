import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  Share2,
  FileText,
  MoreVertical,
} from "lucide-react";
import { useDeletePost } from "../api/postApi";
import { setDeletePost } from "../redux/slice/postSlice";
import { useState } from "react";
import DOMPurify from "dompurify";
import parse from 'html-react-parser';

const PostContentComponent = () => {
  const { postsUserId, isLoading, isError } = useSelector(
    (state) => state.posts
  );
  const dispatch = useDispatch();
  const { mutate: deletePost } = useDeletePost();

  const [expandedPosts, setExpandedPosts] = useState({});
  const [isDeleteLoading, setIsDeleteLoading] = useState(null);

  const handleDelete = (postId) => {
    setIsDeleteLoading(postId);
    deletePost(postId, {
      onSuccess: () => {
        dispatch(setDeletePost(postId));
        setIsDeleteLoading(null);
      },
      onError: (error) => {
        setIsDeleteLoading(null);
      }
    });
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
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

  const customParser = (html) => {
    const sanitizedHtml = DOMPurify.sanitize(html); 
    return parse(sanitizedHtml, {
      replace: (domNode) => {
        if (domNode.name === 'iframe') {
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
        if (domNode.name === 'script') {
          // Skip script tags
          return null;
        }
        return null;
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8  min-h-screen">
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

          if (!post.content) {
            console.warn(
              `Post with ID ${post._id} has undefined content`,
              post
            );
          }

          return (
            <div
              key={post._id}
              className="bg-black border border-base-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[400px] flex flex-col"
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
                        ): (
                          "Delete"
                        )}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Post Content */}
              <div className="p-4 flex-1">
                <div className="text-white text-sm sm:text-base leading-relaxed">
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
                {/* Post Media */}
                {post.imagePic?.length > 0 && (
                  <div className="mt-4">
                    <img
                      src={post.imagePic[0]}
                      alt="Post media"
                      className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                )}
                {post.videos?.length > 0 && (
                  <div className="mt-4">
                    <video
                      src={post.videos[0]}
                      controls
                      className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      aria-label="Post video"
                    />
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
