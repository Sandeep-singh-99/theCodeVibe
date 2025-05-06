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

const PostContentComponent = () => {
  const { postsUserId, isLoading, isError } = useSelector(
    (state) => state.posts
  );

  const dispatch = useDispatch();

  const { mutate: deletePost } = useDeletePost();

  const handleDelete = (postId) => {
    console.log("Deleting post with ID:", postId);
    deletePost(postId, {
      onSuccess: () => {
        dispatch(setDeletePost(postId));
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
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Posts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsUserId.map((post) => (
          <div
            key={post._id}
            className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            role="article"
            aria-labelledby={`post-title-${post._id}`}
          >
            {/* Post Header: User Info */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="avatar mr-3">
                  <div className="w-12 rounded-full ring-2 ring-primary ring-offset-2">
                    <img
                      src={
                        post.userId.profilePic ||
                        "https://via.placeholder.com/48"
                      }
                      alt={`${post.userId.username}'s profile`}
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <h4
                    id={`post-title-${post._id}`}
                    className="text-lg font-semibold text-gray-900"
                  >
                    {post.userId.username}
                  </h4>
                  <p className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1 inline-block">
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
              {/* Three-Dot Dropdown */}
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
                      aria-label={`Delete post by ${post.userId.username}`}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            {/* Post Content */}
            <div className="p-4">
              <p className="text-gray-700 text-base leading-relaxed">
                {post.content}
              </p>
              {/* Post Media (*/}
              {post.imagePic?.length > 0 && (
                <div className="mt-4">
                  <img
                    src={post.imagePic[0]}
                    alt="Post media"
                    className="w-full h-64 object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              )}
              {/*  videos */}
              {post.videos?.length > 0 && (
                <div className="mt-4">
                  <video
                    src={post.videos[0]}
                    controls
                    className="w-full h-64 object-cover rounded-lg"
                    aria-label="Post video"
                  />
                </div>
              )}
            </div>
            {/* Post Actions */}
            <div className="flex justify-between p-4 border-t border-gray-100">
              <button
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors"
                aria-label="Like post"
              >
                <Heart className="w-4 h-4" />
                <span>Like</span>
              </button>
              <button
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                aria-label="Comment on post"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Comment</span>
              </button>
              <button
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-500 transition-colors"
                aria-label="Share post"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostContentComponent;
