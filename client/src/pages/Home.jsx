import React from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function Home() {
  const currentUser = useSelector((state) => state.userProfile);

  console.log(currentUser);
  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      <Navbar />

      <div
        className="flex items-center px-32 justify-between 
            py-4 text-white bg-slate-200 bg-opacity-20 sticky top-0 z-40 h-10"
      >
        <Link to={"/home"}>Home</Link>
        <Link to={"/friends"}>Friends</Link>
        <Link to={"/friends-watchlist"}>Friends Watchlist</Link>
        <Link to={"/manage-watchlist"}>Manage Watchlist</Link>
        <Link to={"/calendar"}>Calendar</Link>
      </div>

      <div className="flex flex-col my-8 gap-10 ml-10">
        <div className="flex flex-col gap-5">
          <span className="font-bold text-4xl">Watching</span>

          <div className="flex gap-8">
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <span className="font-bold text-4xl">Trending</span>

          <div className="flex gap-8">
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <span className="font-bold text-4xl">Upcoming</span>

          <div className="flex gap-8">
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <span className="font-bold text-4xl">Latest</span>

          <div className="flex gap-8">
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
