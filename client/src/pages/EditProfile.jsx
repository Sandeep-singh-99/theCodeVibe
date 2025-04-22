import React, { useState, useEffect } from "react";
import { Camera, User, PencilLine } from "lucide-react";
import { useSelector } from "react-redux";
import { useUpdatedProfile } from "../api/authApi";

export default function EditProfile() {
  const { user } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  const { mutate: updateProfile, isPending } = useUpdatedProfile();

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setPreview(user.profilePic || "https://via.placeholder.com/100");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (profilePic) {
      formData.append("image", profilePic);
    }

    updateProfile(formData);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  if (!user) {
    return (
      <div className="text-center text-white mt-20">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-black text-white shadow-2xl rounded-2xl border border-gray-800">
      <h2 className="text-3xl font-semibold mb-8 text-center flex items-center justify-center gap-2">
        <User className="w-6 h-6" /> Edit Profile
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <label
            htmlFor="profile-pic"
            className="relative group cursor-pointer"
          >
            <img
              src={preview}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-700 group-hover:opacity-80 transition"
            />
            <input
              id="profile-pic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
            <div className="absolute bottom-0 right-0 bg-white text-black p-1 rounded-full text-xs group-hover:scale-105 transition">
              <Camera size={25} className="w-4 h-4" />
            </div>
          </label>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 flex items-center gap-1">
            <User className="w-4 h-4" /> Username
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-zinc-900 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none text-white placeholder-gray-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="john_doe"
          />
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-1 flex items-center gap-1">
            <PencilLine className="w-4 h-4" /> Bio
          </label>
          <textarea
            rows="4"
            className="w-full px-4 py-2 bg-zinc-900 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none text-white placeholder-gray-400 resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short bio about you..."
          ></textarea>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-white text-black py-3 cursor-pointer rounded-lg font-semibold transition duration-200 shadow-lg ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
