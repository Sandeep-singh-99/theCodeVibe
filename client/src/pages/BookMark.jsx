import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDeleteBookmark, useGetAllBookmark } from "../api/bookmarkApi";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookmarkPosts,
  setDeleteBookmark,
} from "../redux/slice/bookmarkSlice";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function BookMark() {
  const { data, isLoading, isError, error } = useGetAllBookmark();
  const deleteBookmarkMutation = useDeleteBookmark();
  const dispatch = useDispatch();
  const { bookmarkPosts } = useSelector((state) => state.bookmark);

  useEffect(() => {
    if (data?.data) {
      dispatch(getBookmarkPosts(data.data));
    }
  }, [data, dispatch]);

  const handleRemoveBookmark = (bookmarkId) => {
    const updatedBookmarks = bookmarkPosts.filter((b) => b._id !== bookmarkId);
    dispatch(setDeleteBookmark(updatedBookmarks));

    deleteBookmarkMutation.mutate(bookmarkId, {
      onSuccess: (response) => {
        toast.success(response.message || "Bookmark removed");
      },
      onError: (err) => {
        toast.error(err.response?.data?.error || "Failed to remove bookmark");
        dispatch(setDeleteBookmark(bookmarkPosts));
      },
    });
  };

  const customParser = (html) => {
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
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500 font-semibold text-lg bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          {error?.response?.data?.error || "Error loading bookmarks."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10 text-center">
          Your Bookmarked Posts
        </h1>

        {bookmarkPosts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-base-200 rounded-2xl shadow-lg">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              You haven't bookmarked any posts yet.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              Explore Posts
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-1">
            {bookmarkPosts.map((bookmark) => {
              const post = bookmark.postId;
              const user = post.userId;

              return (
                <div
                  key={bookmark._id}
                  className="bg-base-300 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={user?.profilePic}
                      alt={user?.username}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2 transition-transform duration-200 hover:scale-105"
                    />
                    <div>
                      <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {user?.username}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none mb-4">
                    {customParser(post.content)}
                  </div>

                  {post.imagePic?.length > 0 && (
                    <img
                      src={post.imagePic[0]}
                      alt="Post media"
                      className="w-full max-h-[400px] object-cover rounded-lg mb-6"
                    />
                  )}
                  {post.videos?.length > 0 && (
                    <video
                      controls
                      className="w-full max-h-[400px] object-cover rounded-lg mb-6"
                    >
                      <source src={post.videos[0]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      Bookmarked on{" "}
                      {new Date(bookmark.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                    <button
                      className="px-4 py-2 bg-red-100 text-red-600 font-medium rounded-full hover:bg-red-200 transition-colors duration-300"
                      onClick={() => handleRemoveBookmark(bookmark._id)}
                    >
                      Remove Bookmark
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
