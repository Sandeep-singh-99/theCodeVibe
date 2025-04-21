import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../api/authApi";
import { logout } from "../redux/slice/authSlice";

export default function Setting() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutattion = useLogout()

  const handleLogout = async () => {
    await logoutMutattion.mutateAsync();
    await dispatch(logout());
    if (error) {
      toast.error(error || "Logout failed");
    } else {
      toast.success("Logout successful");
      navigate("/");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-2">Manage your account settings</p>
      </div>

      <div className="mt-6 max-w-lg mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <img
              src={user?.profilePic || "/default-profile.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-gray-600 hover:scale-105 transition-transform duration-200"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.username || "N/A"}
              </h1>
              <p className="text-gray-400 text-sm">
                {user?.email || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`mt-4 sm:mt-0 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}