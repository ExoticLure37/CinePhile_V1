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
  }, [])

  const getFriends = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/getFriends", {
        withCredentials: true
      })

      dispatch(setFriendList({ friendList: res.data.friendList }));
      // setFriendList(res.data.friendList);
    }
    catch (err) {
      console.log(err);
    }
  }

  console.log(friendsList)

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#141414] text-white">
        <Navbar />
        <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40">
          <LinkNavbar />
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-10">
          <h1 className="text-4xl font-extrabold mb-8 text-gray-200">My Friends</h1>
          <div className="w-full max-w-2xl bg-[#1F1F1F] p-6 rounded-xl shadow-xl border border-gray-700">
            <ul className="space-y-4">
              {friendsList && friendsList.length > 0 ? (
                friendsList.map((friend, index) => (
                  <li
                    key={friend._id}
                    className="flex items-center p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#3A3A3A] transition-all shadow-sm border border-gray-600"
                  >
                    <span className="text-lg font-semibold text-gray-300">{index + 1}.</span>
                    <Link
                      to={`/profile/${friend._id._id}`}
                      className="ml-3 text-lg font-medium text-gray-100 hover:text-blue-400 transition-all"
                    >
                      {friend._id.username}
                    </Link>
                    <div className="ml-auto">
                      <IconBtn text="Remove" />
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-400">No friends found.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;