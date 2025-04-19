import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import LinkNavbar from "../components/LinkNavbar";
import IconBtn from "../components/IconBtn";
import { useDispatch, useSelector } from "react-redux";
import { setFriendList } from '../redux/user/userSlice';

const Friends = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userProfile);

  const [friendsList, setFriendsList] = useState(user.friendList);

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/getFriends", {
        withCredentials: true,
      });
      dispatch(setFriendList({ friendList: res.data.friendList }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white">
      <Navbar />
      <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40">
        <LinkNavbar />
      </div>

      <div className="flex flex-col items-center px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-200 drop-shadow">👥 My Friends</h1>

        <div className="w-full max-w-2xl bg-[#1F1F1F] p-5 rounded-2xl shadow-lg border border-gray-700">
          {friendsList && friendsList.length > 0 ? (
            <ul className="space-y-3">
              {friendsList.map((friend, index) => (
                <li
                  key={friend._id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#2A2A2A] via-[#1E1E1E] to-[#141414] hover:from-[#333333] hover:to-[#292929] transition-all border border-gray-600 shadow-sm"
                >
                  <span className="text-base font-medium text-gray-300">#{index + 1}</span>
                  <Link
                    to={`/profile/${friend._id._id}`}
                    className="text-base font-semibold text-white hover:text-blue-400 transition"
                  >
                    {friend._id.username}
                  </Link>
                  <div className="ml-auto">
                    <IconBtn text="Remove" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 italic py-4">No friends found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
