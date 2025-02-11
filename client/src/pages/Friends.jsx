import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";

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
      <div className="flex flex-col justify-between h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center bg-[#141414] text-white px-4 p-[35px]">
          <h1 className="text-3xl font-bold mb-6">My Friends</h1>
          <div className="w-full max-w-lg bg-[#1F1F1F] p-5 rounded-lg shadow-lg">
            <ul className="space-y-5">
              {friendsList.map((friend) => (
                <li
                  key={friend.id}
                  className="flex justify-between items-center p-3 bg-[#333] rounded-md hover:bg-[#444] transition-all"
                >
                  <span>{friend.name}</span>

                  <div className="flex flex-col justify-center items-center space-y-3">
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="text-white cursor-pointer hover:text-gray-400 transition-all"
                      onClick={() => navigate(`/profile/${friend.id}`)}
                    />
                  </div>
                  <div className=" border-red-600 rounded-md p-2">
                    <button className="text-white bg-red-600 px-4 py-1 rounded-md hover:bg-red-700 transition-all">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;
