import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserById } from '../api/authApi';

export default function UserProfile() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetUserById(id);
  const { user: currentUser } = useSelector((state) => state.auth); 
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (data?.data) {
      console.log('User data:', data.data);
    } else {
      console.log('No user data found');
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-gray-200 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-400 text-lg bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
          Error: {error?.message || 'Failed to load user data'}
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-gray-200 text-lg bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
          No user found
        </div>
      </div>
    );
  }

  const { user, posts } = data.data;

  // Followers and Following components
  const FollowersContent = () => (
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-200 mb-4">Followers</h3>
      <div className="border border-gray-700 rounded-lg shadow-lg p-4 bg-gray-800">
        <ul className="list-none">
          {user?.followers?.length > 0 ? (
            user.followers.map((follower) => (
              <li key={follower._id} className="py-2 flex items-center gap-4">
                <img
                  src={follower.profilePic || 'https://via.placeholder.com/40'}
                  alt={follower.username}
                  className="w-10 h-10 rounded-full border border-purple-700"
                />
                <span className="font-medium text-gray-200">{follower.username}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No followers yet.</p>
          )}
        </ul>
      </div>
    </div>
  );

  const FollowingContent = () => (
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-200 mb-4">Following</h3>
      <div className="border border-gray-700 rounded-lg shadow-lg p-4 bg-gray-800">
        <ul className="list-none">
          {user?.following?.length > 0 ? (
            user.following.map((followed) => (
              <li key={followed._id} className="py-2 flex items-center gap-4">
                <img
                  src={followed.profilePic || 'https://via.placeholder.com/40'}
                  alt={followed.username}
                  className="w-10 h-10 rounded-full border border-purple-700"
                />
                <span className="font-medium text-gray-200">{followed.username}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-400">Not following anyone.</p>
          )}
        </ul>
      </div>
    </div>
  );

  // Posts component (fallback if PostContentComponent is unavailable)
  const PostsContent = () => (
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-200 mb-4">Posts</h3>
      {posts?.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-800 rounded-lg p-5 shadow-md border border-gray-700 hover:shadow-lg transform transition-all duration-200 hover:-translate-y-1"
            >
              <div
                className="text-sm text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              {post.imagePic?.length > 0 && (
                <img
                  src={post.imagePic[0]}
                  alt="Post image"
                  className="mt-4 w-full h-64 object-cover rounded-lg"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                />
              )}
              <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                <span>{post.likes?.length || 0} Likes</span>
                <span>{post.comments?.length || 0} Comments</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No posts available</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Profile Header */}
      <div className="container mx-auto p-4 sm:p-6">
        <div className="card shadow-2xl border border-gray-700 bg-gray-800">
          <div className="card-body">
            {/* Profile Picture and Stats */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-purple-700 ring-offset-gray-800 ring-offset-2">
                  <img
                    src={user?.profilePic || 'https://via.placeholder.com/128'}
                    alt={`${user?.username || 'User'} profile`}
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                {/* Username and Follow Button */}
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <h2 className="text-2xl font-bold text-gray-200">
                    {user?.username || 'User'}
                  </h2>
                  {currentUser?._id !== user?._id && (
                    <button className="btn btn-outline btn-sm border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-gray-200">
                      Follow
                    </button>
                  )}
                </div>
                {/* Stats */}
                <div className="flex justify-center md:justify-start gap-6 mb-4">
                  <div className="flex gap-2">
                    <span className="font-bold text-gray-200">{posts?.length || 0}</span>
                    posts
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-gray-200">{user?.followers?.length || 0}</span>
                    followers
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-gray-200">{user?.following?.length || 0}</span>
                    following
                  </div>
                </div>
                {/* Bio */}
                <p className="text-lg text-gray-300">{user?.bio || 'No bio available'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Posts, Followers, Following */}
        <div className="flex justify-center my-6">
          <div className="inline-flex border-b border-gray-700">
            <button
              className={`px-4 py-2 font-semibold text-sm ${
                activeTab === 'posts'
                  ? 'border-b-2 border-purple-700 text-purple-400'
                  : 'text-gray-400 hover:text-purple-400'
              }`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button
              className={`px-4 py-2 font-semibold text-sm ${
                activeTab === 'followers'
                  ? 'border-b-2 border-purple-700 text-purple-400'
                  : 'text-gray-400 hover:text-purple-400'
              }`}
              onClick={() => setActiveTab('followers')}
            >
              Followers
            </button>
            <button
              className={`px-4 py-2 font-semibold text-sm ${
                activeTab === 'following'
                  ? 'border-b-2 border-purple-700 text-purple-400'
                  : 'text-gray-400 hover:text-purple-400'
              }`}
              onClick={() => setActiveTab('following')}
            >
              Following
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'posts' && <PostsContent />}
          {activeTab === 'followers' && <FollowersContent />}
          {activeTab === 'following' && <FollowingContent />}
        </div>
      </div>
    </div>
  );
}