import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetTotalPosts } from '../api/postApi';
import { setTotalPosts } from '../redux/slice/postSlice';

export default function Profile() {

  const { user } = useSelector((state) => state.auth);

  const { totalPosts } = useSelector((state) => state.posts);

  const {data: totalPost} = useGetTotalPosts()

  const dispatch = useDispatch()

  useEffect(() => {
    if (totalPost) {
      dispatch(setTotalPosts(totalPost.data))
    }
  })

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <div className="container mx-auto p-4">
        <div className="card  shadow-2xl border border-base-100">
          <div className="card-body">
            {/* Profile Picture and Stats */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user?.profilePic} alt="Profile" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                {/* Username and Edit Button */}
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <h2 className="text-2xl font-bold">{user?.username}</h2>
                  <Link to={"/edit-profile"} className="btn btn-outline btn-sm">Edit Profile</Link>
                </div>
                {/* Stats */}
                <div className="flex justify-center md:justify-start gap-6 mb-4">
                  <div>
                    <span className="font-bold">{totalPosts}</span> posts
                  </div>
                  <div>
                    <span className="font-bold">{user?.followers}</span>855 followers
                  </div>
                  <div>
                    <span className="font-bold">{user?.following}</span>356 following
                  </div>
                </div>
                {/* Name and Bio */}
                {/* <h3 className="font-semibold">{user?.username}</h3> */}
                <p className="text-2xl">{user?.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Posts, Followers, Following */}
        <div className="tabs tabs-boxed justify-center my-6">
          <a className="tab tab-active">Posts</a>
          <a className="tab">Followers</a>
          <a className="tab">Following</a>
        </div>

        {/* Posts Grid */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {user.postsData.map((post) => (
            <div key={post.id} className="card bg-base-100 shadow-md">
              <figure>
                <img src={post.image} alt={post.caption} className="w-full h-64 object-cover" />
              </figure>
              <div className="card-body p-4">
                <p className="text-sm truncate">{post.caption}</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}