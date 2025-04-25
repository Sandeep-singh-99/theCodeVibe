import React, {  useState } from "react";
import {  Bell, Binary, BookMarkedIcon, Home, LogIn, MessageCircleCode, Plus, Settings, TrendingUp, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import PostModalComponent from "./PostModalComponent";

export default function LeftSideBar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const naviagate = useNavigate()

  const handleNavClick = (path) => {
    if (!isAuthenticated) {
      toast.error("Please login to access this feature");
    } else {
      naviagate(path)
    }
  }

  return (
    <div className="fixed top-0 lg:left-5 left-0 h-screen w-23 lg:w-64 flex flex-col justify-between lg:items-stretch items-center border-r border-gray-700">
      <div className="flex flex-col items-start">
        <div className="p-4">
          <Binary className="md:hidden block" />
          <h1 className="text-3xl font-bold hidden md:block">Insta</h1>
        </div>

        <nav className="space-y-4 mt-4 w-full font-semibold">
          <Link
            to={""}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full transition-colors lg:w-11/12"
          >
            <Home />
            <span className="hidden lg:inline ml-4 text-xl">Home</span>
          </Link>

          <button onClick={() => handleNavClick("")}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full cursor-pointer transition-colors lg:w-11/12"
          >
            <TrendingUp />
            <span className="hidden lg:inline ml-4 text-xl">Trending</span>
          </button>

          <button onClick={() => handleNavClick("")}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full cursor-pointer transition-colors lg:w-11/12"
          >
            <Bell/>
            <span className="hidden lg:inline ml-4 text-xl">Notification</span>
          </button>

          <button onClick={() => handleNavClick("")}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full cursor-pointer transition-colors lg:w-11/12"
          >
            <MessageCircleCode />
            <span className="hidden lg:inline ml-4 text-xl">Message</span>
          </button>

          <button onClick={() => handleNavClick("/bookmark")}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full cursor-pointer transition-colors lg:w-11/12"
          >
            <BookMarkedIcon/>
            <span className="hidden lg:inline ml-4 text-xl">BookMark</span>
          </button>


          {
            isAuthenticated && (
              <button
              onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full cursor-pointer transition-colors lg:w-11/12"
          >
            <Plus/>
            <span className="hidden lg:inline ml-4 text-xl">Create</span>
          </button>  
            )
          }

          <PostModalComponent
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
          />        

          <button onClick={() => handleNavClick("")}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full cursor-pointer transition-colors lg:w-11/12"
          >
            <UserCircle/>
            <span className="hidden lg:inline ml-4 text-xl">Profile</span>
          </button>

          <button onClick={() => handleNavClick("/setting")}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full cursor-pointer transition-colors lg:w-11/12"
          >
            <Settings/>
            <span className="hidden lg:inline ml-4 text-xl">Settings</span>
          </button>

          {
            isAuthenticated ? (
              <div className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full transition-colors lg:w-11/12">
                <img
                src={user?.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:border-gray-300 transition-colors"
                />
                <h1 className="ml-2 text-xl hidden md:block">{user?.username}</h1>
              </div>
            ) : (
              <Link
                to={"/login"}
                className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full transition-colors lg:w-11/12"
              >
                <LogIn />
                <span className="hidden lg:inline ml-4 text-xl">Login</span>
              </Link>
            )
          }
        </nav>
      </div>
    </div>
  );
}
