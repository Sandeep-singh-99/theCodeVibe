import React from "react";
import { Bell, Binary, BookMarkedIcon, Home, LogIn, MessageCircleCode, TrendingUp, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function LeftSideBar() {
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

          <Link
            to={""}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full transition-colors lg:w-11/12"
          >
            <TrendingUp />
            <span className="hidden lg:inline ml-4 text-xl">Trending</span>
          </Link>

          <Link
            to={""}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full transition-colors lg:w-11/12"
          >
            <Bell/>
            <span className="hidden lg:inline ml-4 text-xl">Notification</span>
          </Link>

          <Link
            to={""}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full transition-colors lg:w-11/12"
          >
            <MessageCircleCode />
            <span className="hidden lg:inline ml-4 text-xl">Message</span>
          </Link>

          <Link
            to={""}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full transition-colors lg:w-11/12"
          >
            <BookMarkedIcon/>
            <span className="hidden lg:inline ml-4 text-xl">BookMark</span>
          </Link>

          <Link
            to={""}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full transition-colors lg:w-11/12"
          >
            <UserCircle/>
            <span className="hidden lg:inline ml-4 text-xl">Profile</span>
          </Link>

          <Link
            to={"/login"}
            className="flex items-center px-4 py-2 text-white hover:bg-[#181818] rounded-full transition-colors lg:w-11/12"
          >
            <LogIn />
            <span className="hidden lg:inline ml-4 text-xl">Login</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
