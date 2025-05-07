import React, { useEffect } from "react";
import { useGetSuggestedUsers } from "../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsers } from "../redux/slice/authSlice";

const SuggestedUsers = () => {
  const { data: suggestedUsersFetch } = useGetSuggestedUsers();
  const { suggestedUsers, user } = useSelector((state) => state.auth);

  const disptach = useDispatch()

  useEffect(() => {
    if (suggestedUsersFetch?.data) {
      disptach(setSuggestedUsers(suggestedUsersFetch.data))
    }
  })

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
        <h2 className="text-sm font-semibold text-gray-400">Suggested for you</h2>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {suggestedUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={user.profilePic}
                alt={`${user.username} profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-semibold">{user.username}</span>
                  {user.verified && (
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <button className="text-blue-500 text-sm font-semibold">Follow</button>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="mt-6 text-xs text-gray-500">
        <p className="mt-2">© 2025 Insta developed by sandeep singh</p>
      </div>
    </div>
  );
};

export default SuggestedUsers;