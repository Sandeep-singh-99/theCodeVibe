// import React, { useEffect } from 'react';
// import { useGetAllBookmark } from '../api/bookmarkApi';
// import { useDispatch, useSelector } from 'react-redux';
// import { getBookmarkPosts } from '../redux/slice/bookmarkSlice';

// export default function BookMark() {
//   const { data, isLoading, isError, error } = useGetAllBookmark();
//   const dispatch = useDispatch();
//   const { bookmarkPosts } = useSelector((state) => state.bookmark);

//   useEffect(() => {
//     if (data) {
//       dispatch(getBookmarkPosts(data.data));
//     }
//     if (isError) {
//       console.error("Error fetching bookmarks:", error?.response?.data?.error || error.message);
//     }
//   }, [data, isError, error, dispatch]);


//   const handleRemoveBookmark = (bookmarkId) => {
//     alert(`Remove bookmark with ID: ${bookmarkId} (Functionality coming soon)`);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-red-500 font-semibold text-lg">Error loading bookmarks.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Bookmarked Posts</h1>

//       {bookmarkPosts.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't bookmarked any posts yet.</p>
//           <a
//             href="/explore"
//             className="mt-4 inline-block text-primary hover:underline"
//           >
//             Explore posts to bookmark
//           </a>
//         </div>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
//           {bookmarkPosts.map((bookmark) => {
//             const post = bookmark.postId;
//             const user = post.userId;

//             return (
//               <div
//                 key={bookmark._id}
//                 className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
//               >
//                 {/* User Info */}
//                 <div className="flex items-center gap-4 mb-4">
//                   <img
//                     src={user.profilePic}
//                     alt={user.username}
//                     className="w-14 h-14 rounded-full object-cover ring-2 ring-primary ring-offset-2 transition-transform duration-200 hover:scale-105"
//                   />
//                   <div>
//                     <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{user.username}</h2>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
//                   </div>
//                 </div>

//                 {/* Post Content */}
//                 <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
//                   {post.content || "No text content."}
//                 </p>

//                 {/* Post Image or Video */}
//                 {post.imagePic.length > 0 && (
//                   <img
//                     src={post.imagePic[0]}
//                     alt="Post media"
//                     className="w-full max-h-[400px] object-contain rounded-lg mb-4"
//                   />
//                 )}
//                 {post.videos.length > 0 && (
//                   <video
//                     controls
//                     className="w-full max-h-[400px] object-contain rounded-lg mb-4"
//                   >
//                     <source src={post.videos[0]} type="video/mp4" />
//                     Your browser does not support the video tag.
//                   </video>
//                 )}

//                 {/* Timestamp + Button */}
//                 <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
//                   <span>
//                     Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
//                       month: 'short',
//                       day: 'numeric',
//                       year: 'numeric',
//                     })}
//                   </span>
//                   <button
//                     className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
//                     onClick={() => handleRemoveBookmark(bookmark._id)}
//                   >
//                     Remove Bookmark
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useEffect } from 'react';
import { useGetAllBookmark } from '../api/bookmarkApi';
import { useDispatch, useSelector } from 'react-redux';
import { getBookmarkPosts } from '../redux/slice/bookmarkSlice';

export default function BookMark() {
  const { data, isLoading, isError, error } = useGetAllBookmark();
  const dispatch = useDispatch();
  const { bookmarkPosts } = useSelector((state) => state.bookmark);

  useEffect(() => {
    if (data) {
      dispatch(getBookmarkPosts(data.data));
    }
    if (isError) {
      console.error("Error fetching bookmarks:", error?.response?.data?.error || error.message);
    }
  }, [data, isError, error, dispatch]);

  const handleRemoveBookmark = (bookmarkId) => {
    alert(`Remove bookmark with ID: ${bookmarkId} (Functionality coming soon)`);
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
          Error loading bookmarks.
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
            <a
              href="/explore"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              Explore Posts
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-1">
            {bookmarkPosts.map((bookmark) => {
              const post = bookmark.postId;
              const user = post.userId;

              return (
                <div
                  key={bookmark._id}
                  className="bg-black border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2 transition-transform duration-200 hover:scale-105"
                    />
                    <div>
                      <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {user.username}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-700 dark:text-white mb-6 leading-relaxed font-semibold">
                    {post.content || "No text content."}
                  </p>

                  {/* Post Image or Video */}
                  {post.imagePic.length > 0 && (
                    <img
                      src={post.imagePic[0]}
                      alt="Post media"
                      className="w-full max-h-[400px] object-cover rounded-lg mb-6"
                    />
                  )}
                  {post.videos.length > 0 && (
                    <video
                      controls
                      className="w-full max-h-[400px] object-cover rounded-lg mb-6"
                    >
                      <source src={post.videos[0]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* Timestamp + Button */}
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      Bookmarked on{' '}
                      {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
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