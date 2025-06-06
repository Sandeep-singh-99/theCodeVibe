import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetPostByUser, useGetTotalPosts } from "../api/postApi";
import { setPostsUserId, setTotalPosts } from "../redux/slice/postSlice";
import PostContentComponent from "../components/PostContentComponent";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const { totalPosts } = useSelector((state) => state.posts);
  const { data: totalPost } = useGetTotalPosts();

  const { data: postByUser } = useGetPostByUser();

  const dispatch = useDispatch();

  // State for active tab
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (totalPost?.data) {
      dispatch(setTotalPosts(totalPost.data));
    }
    if (postByUser?.data) {
      dispatch(setPostsUserId(postByUser.data));
    }
  }, [totalPost, postByUser, dispatch]);

  const FollowersContent = () => (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Followers</h3>
      <div className="border rounded-lg shadow-lg p-4">
        <ul className="list-none">
          {user?.followers.length > 0 ? (
            user.followers.map((follower) => (
              <li key={follower._id} className="py-2 flex items-center gap-4">
                <img
                  src={follower.profilePic || "https://via.placeholder.com/40"}
                  alt={follower.username}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{follower.username}</span>
              </li>
            ))
          ) : (
            <p>No followers yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
  
  const FollowingContent = () => (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Following</h3>
      <div className="border rounded-lg shadow-lg p-4">
        <ul className="list-none">
          {user?.following.length > 0 ? (
            user.following.map((followed) => (
              <li key={followed._id} className="py-2 flex items-center gap-4">
                <img
                  src={followed.profilePic}
                  alt={followed.username}
                  className="w-12 h-12 border border-purple-700 rounded-full"
                />
                <span className="font-medium text-white">{followed.username}</span>
              </li>
            ))
          ) : (
            <p>You're not following anyone.</p>
          )}
        </ul>
      </div>
    </div>
  );
  

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <div className="container mx-auto p-4">
        <div className="card shadow-2xl border border-base-100">
          <div className="card-body">
            {/* Profile Picture and Stats */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={user?.profilePic || "https://via.placeholder.com/128"}
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                {/* Username and Edit Button */}
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <h2 className="text-2xl font-bold">
                    {user?.username || "User"}
                  </h2>
                  <Link to="/edit-profile" className="btn btn-outline btn-sm">
                    Edit Profile
                  </Link>
                </div>
                {/* Stats */}
                <div className="flex justify-center md:justify-start gap-6 mb-4">
                  <div className="flex gap-2">
                    <span className="font-bold">{totalPosts || 0}</span>posts
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold">{user?.followers.length || 0}</span>
                    followers
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold">{user?.following.length || 0}</span>
                    following
                  </div>
                </div>
                {/* Bio */}
                <p className="text-2xl">{user?.bio || "No bio available"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Posts, Followers, Following */}
        <div className="flex justify-center my-6">
          <div className="inline-flex border-b border-gray-300">
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "posts"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "followers"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("followers")}
            >
              Followers
            </button>
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "following"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === "posts" && <PostContentComponent />}
          {activeTab === "followers" && <FollowersContent />}
          {activeTab === "following" && <FollowingContent />}
        </div>
      </div>
    </div>
  );
}
