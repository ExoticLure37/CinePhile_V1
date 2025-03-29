import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const friendsList = [
  { id: 1, name: "Aryan Maurya" },
  { id: 2, name: "Aryan Maurya" },
  { id: 3, name: "Aryan Maurya" },
  { id: 4, name: "Aryan Maurya" },
];

const Friends = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#141414]">
        <Navbar />
        <div className="flex flex-col items-center justify-center  text-white px-4 p-[35px]">
          <h1 className="text-3xl font-bold mb-6">My Friends</h1>
          <div className="w-full  bg-[#1F1F1F] p-5 rounded-lg shadow-lg">
            <ul className="space-y-5">
              {friendsList.map((friend, index) => (
                <li
                  key={friend.id}
                  className="flex items-center p-3 bg-[#333] rounded-md hover:bg-[#444] transition-all"
                >
                  <span className="text-md font-semibold text-white">{index + 1}.</span>
                  <Link to={`/profile/${friend.id}`} className="hover:underline ml-2">{friend.name}</Link>

                  <div className=" border-red-600 rounded-md p-2 ml-auto">
                    <button className="text-white bg-red-600 px-4 py-1 rounded-md hover:bg-red-700 transition-all">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default Friends;
