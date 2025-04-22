import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../api/authApi";
import { logout } from "../redux/slice/authSlice";
import { User, LogOut } from "lucide-react";

export default function Setting() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      await dispatch(logout());
      toast.success("Logout successful");
      navigate("/");
    } catch (err) {
      toast.error(error || "Logout failed");
    }
  };

  const settingsOptions = [
    { icon: <User size={20} />, label: "Edit Profile", path: "/edit-profile" },
    {
      icon: <LogOut size={20} />,
      label: "Logout",
      action: handleLogout,
      disabled: loading,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
          <div>
            <h2 className="text-lg font-semibold">{user?.username || "N/A"}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="px-4 py-2">
        {settingsOptions.map((option, index) => (
          <button
            key={index}
            onClick={option.action || (() => navigate(option.path))}
            disabled={option.disabled}
            aria-label={option.label}
            className={`flex items-center w-full py-4 px-2 text-left text-base font-medium border-b border-gray-800 hover:bg-gray-800 transition-colors duration-150 ${
              option.disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="mr-4 text-gray-600 dark:text-gray-300">
              {option.icon}
            </span>
            <span>{option.label}</span>
            {option.label === "Logout" && loading && (
              <svg
                className="animate-spin h-5 w-5 ml-2 text-gray-600 dark:text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
