import React, { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const currentUser = useSelector((state) => state.userProfile)

  return (
    <div className="navbar w-full flex justify-between items-center
             py-2 px-6 text-white bg-[#E50914]">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">projectV</a>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div tabindex="0" role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul
            tabindex="0"
            className="menu menu-sm dropdown-content bg-black rounded-box z-50 mt-3 w-52 p-2 shadow">
            <li>
              <a>
                {currentUser.username}
              </a>
            </li>
            <li><a>My List</a></li>
            <li><a>Contact</a></li>
            <li><a>Settings</a></li>
          </ul>
        </div>
      </div>


      <div className="flex items-center px-32 justify-between border-b-2 py-4 border-slate-200 h-7 ">
        <a href="/home">
          <span>Home</span>
        </a>
        <a href="./friends">
          <span>Friends</span>
        </a>
        <span>Friends Watchlist</span>
        <span>Manage Watchlist</span>
        <span>Calendar</span>
      </div>
    </>

    </div>
  );
};

export default Navbar;
