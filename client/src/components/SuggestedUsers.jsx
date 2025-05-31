import React, { useEffect } from "react";
import { useGetSuggestedUsers } from "../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsers } from "../redux/slice/authSlice";
import FollowUnfollowButton from "./FollowUnFollowBtn";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { data: suggestedUsersFetch } = useGetSuggestedUsers();
  const { suggestedUsers, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (suggestedUsersFetch?.data) {
      dispatch(setSuggestedUsers(suggestedUsersFetch.data));
    }
  }, [suggestedUsersFetch, dispatch]);

  return (
    <div className="card bg-black border border-base-300 text-white p-4 rounded-lg max-w-sm mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-600 rounded-full">
            <img
              src={user?.profilePic}
              alt={`${user?.username} profile`}
              className="w-10 h-10 rounded-full border border-purple-900 object-cover"
            />
          </div>
          <span className="font-semibold">{user?.username}</span>
        </div>
      </div>

      {/* Suggested for you section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-400">
          Suggested for you
        </h2>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {suggestedUsers.map((suggestedUser) => (
          <div
            key={suggestedUser._id}
            className="flex items-center justify-between"
          >
            <Link to={`/user-profile/${suggestedUser._id}`} className="flex items-center space-x-3">
              <img
                src={suggestedUser.profilePic}
                alt={`${suggestedUser.username} profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-semibold">
                    {suggestedUser.username}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{suggestedUser.email}</p>
              </div>
            </Link>
            {suggestedUser._id !== user._id && (
              <FollowUnfollowButton
                userId={suggestedUser._id}
                className="text-sm font-semibold"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 text-xs text-gray-500">
        <p className="mt-2">© 2025 Insta developed by Sandeep Singh</p>
      </div>
    </div>
  );
};

export default SuggestedUsers;