import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full flex justify-between items-center py-4 px-6 bg-[#E50914] rounded-lg text-white">
        <h1 className="text-2xl font-bold">projectV</h1>

        <div className="flex items-center gap-4">
          <span className="text-lg font-medium hidden sm:block">Welcome</span>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </button>
            {isOpen && (
              <ul className="absolute right-0 mt-3 w-48 bg-[#1F1F1F] text-white rounded-lg shadow-lg p-2">
                <li className="py-2 px-3 hover:bg-[#333] rounded-md cursor-pointer">
                  My Account
                </li>
                <li className="py-2 px-3 hover:bg-[#333] rounded-md cursor-pointer">
                  My List
                </li>
                <li className="py-2 px-3 hover:bg-[#333] rounded-md cursor-pointer">
                  Contact
                </li>
                <li className="py-2 px-3 hover:bg-[#333] rounded-md cursor-pointer">
                  Settings
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center px-32 justify-between border-b-2 py-4 border-slate-200 h-7 ">
        <span>Home</span>
        <a href="./friends">
          <span>Friends</span>
        </a>
        <span>Friends Watchlist</span>
        <span>Manage Watchlist</span>
        <span>Calendar</span>
      </div>
    </>
  );
};

export default Navbar;
