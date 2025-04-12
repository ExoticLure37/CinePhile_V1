import React, { useEffect, useState } from "react";
import axios from "axios";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "./IconBtn";
import {
  setFriendList,
  setPendingRequest,
  setRequestSent,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

function FriendRequests() {
  const [pRequest, setPRequest] = useState([]);
  const [rSent, setRSent] = useState([]);

  const [friendUsername, setFriendUsername] = useState("");

  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const currentUser = useSelector((state) => state.userProfile);

  useEffect(() => {
    getPendingRequests();
    getRequestSent();
  }, []);

  const getPendingRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/user/pendingRequests",
        {
          withCredentials: true,
        }
      );

      // console.log(res);

      setPRequest(res.data.pending_requests);
      dispatch(
        setPendingRequest({ pending_requests: res.data.pending_requests })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getRequestSent = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/requestSent", {
        withCredentials: true,
      });

      // console.log(res);

      setRSent(res.data.requests_sent);
      dispatch(setRequestSent({ request_sent: res.data.requests_sent }));
      // console.log(requestSent)
    } catch (err) {
      console.log(err);
    }
  };

  const addFriend = async () => {
    try {
      if (friendUsername === currentUser.username) {
        setMessage("Incorrect Username!!");
        setShowModal(true);
        return;
      }
      const res = await axios.patch(
        "http://localhost:5000/user/addFriend",
        { friendsId: friendUsername },
        { withCredentials: true }
      );
      setMessage(res.data.message);
      setShowModal(true);
      getRequestSent();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setShowModal(true);
    }
  };

  const cancelFriendRequest = async (id) => {
    try {
      console.log(id);
      const res = await axios.patch(
        "http://localhost:5000/user/cancelFriendRequest",
        {
          friendId: id,
        },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setShowModal(true);

      getRequestSent();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setShowModal(true);
    }
  };

  const acceptFriendRequest = async (id) => {
    try {
      const res = await axios.patch(
        "http://localhost:5000/user/acceptFriendRequest",
        {
          friendId: id,
        },
        { withCredentials: true }
      );
      setMessage(res.data.message);
      setShowModal(true);
      getPendingRequests();
      getFriends();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setShowModal(true);
    }
  };

  const getFriends = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/getFriends", {
        withCredentials: true,
      });

      dispatch(setFriendList({ friendList: res.data.friendList }));
      // setFriendsList(res.data.friendList)
    } catch (err) {
      console.log(err.message);
    }
  };

  const rejectFriendRequest = async (id) => {
    try {
      const res = await axios.patch(
        "http://localhost:5000/user/rejectFriendRequest",
        {
          friendId: id,
        },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setShowModal(true);
      getPendingRequests();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      console.log(err.message);
      setShowModal(true);
    }
  };

  const onChangeFriendUsername = (e) => {
    setFriendUsername(e.target.value);
  };

  return (
    <div className="flex flex-col items-center px-6 py-10 bg-[#121212] min-h-screen text-white">
      <div className="w-full max-w-4xl space-y-8">
        {/* Add Friend Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">
            Send a Friend Request
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter a username"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={friendUsername}
              onChange={onChangeFriendUsername}
            />
            <IconBtn text="Add" onClick={addFriend} />
          </div>
        </div>

        {/* Request Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Pending Requests
            </h3>
            <ul className="space-y-3">
              {pRequest.length === 0 && (
                <p className="text-gray-400 text-center">No pending requests</p>
              )}
              {pRequest.map((e) => (
                <li
                  key={e.userId}
                  className="flex justify-between items-center px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
                >
                  <Link
                    to={`/profile/${e.userId}`}
                    className="text-lg font-medium text-white hover:text-blue-400"
                  >
                    {e.username}
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptFriendRequest(e.userId)}
                      className="hover:scale-110 transition-transform"
                      title="Accept"
                    >
                      <TiTick className="text-green-400 text-2xl" />
                    </button>
                    <button
                      onClick={() => rejectFriendRequest(e.userId)}
                      className="hover:scale-110 transition-transform"
                      title="Reject"
                    >
                      <ImCross className="text-red-400 text-md" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sent Requests */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Requests Sent
            </h3>
            <ul className="space-y-3">
              {rSent.length === 0 && (
                <p className="text-gray-400 text-center">No sent requests</p>
              )}
              {rSent.map((e) => (
                <li
                  key={e.userId}
                  className="flex justify-between items-center px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
                >
                  <Link
                    to={`/profile/${e.userId}`}
                    className="text-lg font-medium text-white hover:text-blue-400"
                  >
                    {e.username}
                  </Link>
                  <button
                    onClick={() => cancelFriendRequest(e.userId)}
                    className="hover:scale-110 transition-transform"
                    title="Cancel"
                  >
                    <ImCross className="text-red-400 text-md" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl text-center transform scale-105 transition">
            <p className="text-gray-900 text-lg font-semibold mb-4">
              {message}
            </p>
            <IconBtn text="OK" onClick={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendRequests;
