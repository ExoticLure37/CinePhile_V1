import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";


const Friends = () => {
  const navigate = useNavigate();

  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    getFriends();
  }, [])

  const getFriends = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/getFriends", {
        withCredentials: true
      })

      console.log(res.data);

      setFriendList(res.data.friendList);
    }
    catch (err) {
      console.log(err);
    }
  }

  console.log(friendList)

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#141414]">
        <Navbar />
        <div className="flex flex-col items-center justify-center  text-white px-4 p-[35px]">
          <h1 className="text-3xl font-bold mb-6">My Friends</h1>
          <div className="w-3/4 bg-[#1F1F1F] p-5 rounded-lg shadow-lg">
            <ul className="space-y-5">
              {friendList && friendList.map((friend, index) => (
                <li
                  key={friend._id}
                  className="flex items-center p-3 bg-[#333] rounded-md hover:bg-[#444] transition-all"
                >
                  <span className="text-md font-semibold text-white">{index + 1}.</span>
                  <Link to={`/profile/${friend._id}`} className="hover:underline ml-2">{friend._id.username}</Link>

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
      </div>
    </>
  );
};

export default Friends;
