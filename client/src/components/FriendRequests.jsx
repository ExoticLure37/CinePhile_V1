import React, { useEffect, useState } from 'react'
import axios from "axios"
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from "./IconBtn";
import { setFriendList } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

function FriendRequests() {
    const [pendingRequest, setPendingRequest] = useState([]);
    const [requestSent, setRequestSent] = useState([]);

    const [friendUsername, setFriendUsername] = useState("");

    const dispatch = useDispatch();

    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const currentUser = useSelector((state) => state.userProfile);

    useEffect(() => {
        getPendingRequests();
        getRequestSent();
    }, [])

    const getPendingRequests = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user/pendingRequests", {
                withCredentials: true
            })

            // console.log(res);

            setPendingRequest(res.data.pending_requests)
        }
        catch (err) {
            console.log(err);
        }
    }

    const getRequestSent = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user/requestSent", {
                withCredentials: true
            })

            // console.log(res);

            setRequestSent(res.data.requests_sent)
            // console.log(requestSent)
        }
        catch (err) {
            console.log(err);
        }
    }

    const addFriend = async () => {
        try {
            if (friendUsername === currentUser.username) {
                setMessage("Incorrect Username!!");
                setShowModal(true);
                return;
            }
            const res = await axios.patch("http://localhost:5000/user/addFriend", { friendsId: friendUsername }, { withCredentials: true });
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
            console.log(id)
            const res = await axios.patch("http://localhost:5000/user/cancelFriendRequest", {
                friendId: id
            }, { withCredentials: true })

            setMessage(res.data.message);
            setShowModal(true)

            getRequestSent();
        }
        catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong");
            setShowModal(true);
        }
    }

    const acceptFriendRequest = async (id) => {
        try {
            const res = await axios.patch("http://localhost:5000/user/acceptFriendRequest", {
                friendId: id
            }, { withCredentials: true })
            setMessage(res.data.message);
            setShowModal(true)
            getPendingRequests();
            getFriends();
        }
        catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong");
            setShowModal(true);
        }
    }

    const getFriends = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user/getFriends", {
                withCredentials: true
            })

            dispatch(setFriendList({ friendList: res.data.friendList }))
            // setFriendsList(res.data.friendList)
        }
        catch (err) {
            console.log(err.message);
        }
    }

    const rejectFriendRequest = async (id) => {
        try {
            const res = await axios.patch("http://localhost:5000/user/rejectFriendRequest", {
                friendId: id
            }, { withCredentials: true })

            setMessage(res.data.message);
            setShowModal(true)
            getPendingRequests();
        }
        catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong");
            console.log(err.message)
            setShowModal(true);
        }
    }

    const onChangeFriendUsername = (e) => {
        setFriendUsername(
            e.target.value
        )
    }

    return (
        <div className='flex flex-col items-center p-6 bg-[#141414] min-h-screen text-white'>
            <div className='w-full max-w-4xl flex flex-col gap-4'>
                <div className='bg-gray-800 p-4 rounded-lg shadow-md'>
                    {/* <h2 className='text-xl font-semibold mb-4 text-center'>Send Friend Request</h2> */}
                    <div className='flex gap-2'>
                        <input
                            type="text"
                            placeholder='Enter Username'
                            className='flex-1 p-2 text-black rounded-md border border-gray-600 focus:outline-none'
                            value={friendUsername}
                            onChange={onChangeFriendUsername}
                        />
                        <IconBtn text="Add Friend" onClick={addFriend} />
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-gray-800 p-4 rounded-lg shadow-md'>
                        <h2 className='text-xl font-semibold mb-4 text-center'>Pending Friend Requests</h2>
                        <ul className='space-y-2'>
                            {pendingRequest.map((e) => (
                                <li key={e.userId} className='flex justify-between p-3 bg-gray-700 rounded-md'>
                                    <Link
                                        to={`/profile/${e.userId}`}
                                        className="ml-3 text-lg font-medium text-gray-100 hover:text-blue-400 transition-all"
                                    >
                                        {e.username}
                                    </Link>
                                    <div className='flex gap-2'>
                                        <button onClick={() => acceptFriendRequest(e.userId)}>
                                            <TiTick className='text-green-400 text-2xl' />
                                        </button>
                                        <button onClick={() => rejectFriendRequest(e.userId)}>
                                            <ImCross className='text-red-400 text-sm' />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='bg-gray-800 p-4 rounded-lg shadow-md'>
                        <h2 className='text-xl font-semibold mb-4 text-center'>Friend Requests Sent</h2>
                        <ul className='space-y-2'>
                            {requestSent.map((e) => (
                                <li key={e.userId} className='flex justify-between p-3 bg-gray-700 rounded-md'>
                                    <Link
                                        to={`/profile/${e.userId}`}
                                        className="ml-3 text-lg font-medium text-gray-100 hover:text-blue-400 transition-all"
                                    >
                                        {e.username}
                                    </Link>
                                    <button onClick={() => cancelFriendRequest(e.userId)}>
                                        <ImCross className='text-red-400 text-sm' />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-md w-1/3 text-center shadow-2xl transform scale-105 transition-all duration-300">
                        <p className="text-black text-lg font-semibold mb-2">{message}</p>
                        <IconBtn text="OK" onClick={() => setShowModal(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default FriendRequests