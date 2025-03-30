import React, { useEffect, useState } from 'react'
import axios from "axios"
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import { useSelector } from 'react-redux';

function FriendRequests() {
    const [pendingRequest, setPendingRequest] = useState([]);
    const [requestSent, setRequestSent] = useState([]);

    const [friendUsername, setFriendUsername] = useState("");

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

            console.log(res);

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
            if (friendUsername == currentUser.username) {
                console.log("Incorrect Username!!");
                return;
            }
            const res = await axios.patch("http://localhost:5000/user/addFriend", {
                friendsId: friendUsername
            }, { withCredentials: true })

            console.log(res);

            getRequestSent();
        }
        catch (err) {
            console.log(err);
        }
    }

    const cancelFriendRequest = async (id) => {
        try {
            console.log(id)
            const res = await axios.patch("http://localhost:5000/user/cancelFriendRequest", {
                friendId: id
            }, { withCredentials: true })

            console.log(res)

            getRequestSent();
        }
        catch (err) {
            console.log(err);
        }
    }

    const acceptFriendRequest = async (id) => {
        try {
            const res = await axios.patch("http://localhost:5000/user/acceptFriendRequest", {
                friendId: id
            }, { withCredentials: true })

            getPendingRequests();
        }
        catch (err) {
            console.log(err);
        }
    }

    const rejectFriendRequest = async (id) => {
        try {
            const res = await axios.patch("http://localhost:5000/user/rejectFriendRequest", {
                friendId: id
            }, { withCredentials: true })

            getPendingRequests();
        }
        catch (err) {
            console.log(err);
        }
    }

    const onChangeFriendUsername = (e) => {
        setFriendUsername(
            e.target.value
        )
    }

    return (
        <div className='flex flex-col'>
            <div className='flex justify-between gap-10'>
                <div className='w-1/2 flex flex-col gap-2'>
                    <span className='mx-auto'>Pending Friend Requests</span>
                    <div className='bg-[#1F1F1F] min-h-screen w-full rounded-md'>
                        <div className='mt-2 mx-2'>
                            {pendingRequest && pendingRequest.map((e) => (
                                <li
                                    key={e.userId}
                                    className="flex items-center justify-between p-3 bg-[#333] rounded-md hover:bg-[#444] transition-all"
                                >
                                    <span className="text-md font-semibold text-white">{e.username}</span>
                                    <div className='flex gap-2'>
                                        <button onClick={() => acceptFriendRequest(e.userId)}><TiTick className='text-green-400 text-3xl' /></button>
                                        <button onClick={() => rejectFriendRequest(e.userId)}><ImCross className='text-red-400' /></button></div>

                                </li>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='w-1/2 flex flex-col gap-2'>
                    <span className='mx-auto'>Friend Requests Sent</span>
                    <div className='flex flex-col bg-[#1F1F1F] min-h-screen w-full rounded-md'>
                        <div className='flex mt-3 mx-auto w-full justify-center gap-2'>
                            <input type="text"
                                placeholder='Enter Username'
                                className='w-3/4 p-2 text-black rounded-md'
                                value={friendUsername}
                                name='friendUsername'
                                onChange={onChangeFriendUsername} />
                            <button className="text-white text-xs bg-red-600 px-1 rounded-md hover:bg-red-700 transition-all"
                                onClick={addFriend}>
                                Add Friend
                            </button>
                        </div>

                        <div className='mt-2 mx-2'>
                            {requestSent && requestSent.map((e) => (
                                <li
                                    key={e.userId}
                                    className="flex items-center justify-between p-3 bg-[#333] rounded-md hover:bg-[#444] transition-all"
                                >
                                    <span className="text-md font-semibold text-white">{e.username}</span>
                                    <button onClick={() => cancelFriendRequest(e.userId)}><ImCross className='text-red-400' /></button>
                                </li>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FriendRequests