import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const currentUser = useSelector((state) => state.userProfile)
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/signin")
  }

  return (
    <div>
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
                {currentUser.username !== '' ? <a onClick={() => navigate("/dashboard")}>{currentUser.username}</a> : <Link to={'/signin'}>Login</Link>}
              </li>
              <li><a>My List</a></li>
              <li><a>Contact</a></li>
              <li><a>Settings</a></li>

              {currentUser.username !== '' && < li><a onClick={logoutHandler}>Logout</a></li>}
            </ul>
          </div>
        </div>
      </div >
    </div>
  );
};

export default Navbar;