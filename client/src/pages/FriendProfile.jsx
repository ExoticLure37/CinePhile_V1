import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import IconBtn from "../components/IconBtn";
import EditPersonalDetailsModal from "../components/EditPersonalDetailsModal";
// import EditAccountSettingsModal from "../components/EditAccountSettingsModal";
import profileimage from "../image/photo.jpg";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setFriendList, setPendingRequest, setRequestSent } from "../redux/user/userSlice";

export default function FriendProfile() {
    const [showPersonalModal, setShowPersonalModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.userProfile);

    const [friendsList, setFriendsList] = useState(currentUser.friendList);
    const [pRequest, setPRequest] = useState(currentUser.pending_requests)
    const [rSent, setRSent] = useState(currentUser.request_sent)

    const [isFriend, setIsFriend] = useState("Add Friend");

    const [user, setUser] = useState({
        username: "",
        fullname: "",
        email: "",
        about: "",
        gender: "",
        dob: "",
        phone_number: ""
    });

    const { friendId } = useParams();

    useEffect(() => {
        getFriendProfile();
        checkIfIsFriend();
        getPendingRequests();
        getRequestSent();
    }, [])

    const checkIfIsFriend = () => {
        friendsList.map((e) => {
            if (e._id._id === friendId) {
                setIsFriend("Unfriend");
                return;
            }
        })

        rSent.map((e) => {
            if (e.userId === friendId) {
                setIsFriend("Request Pending");
                return;
            }
        })

        pRequest.map((e) => {
            if (e.userId === friendId) {
                setIsFriend("Accept Friend Request");
                return;
            }
        })
    }

    const getFriendProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/user/getProfile/${friendId}`)

            setUser(res.data);
            // console.log(res.data)
        }
        catch (err) {
            console.log(err.message);
        }
    }

    const getFriends = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user/getFriends", {
                withCredentials: true
            })

            dispatch(setFriendList({ friendList: res.data.friendList }))
            setFriendsList(res.data.friendList)
        }
        catch (err) {
            console.log(err.message);
        }
    }

    const getPendingRequests = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user/pendingRequests", {
                withCredentials: true
            })

            console.log(res);

            dispatch(setPendingRequest({ pending_requests: res.data.pending_requests }))
            setPRequest(res.data.pending_requests)
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

            console.log(res.data);

            dispatch(setRequestSent({ request_sent: res.data.requests_sent }))
            setRSent(res.data.requests_sent)
        }
        catch (err) {
            console.log(err);
        }
    }

    const onClickFriendHandler = async () => {
        try {
            if (isFriend === "Unfriend") {
                const res = await axios.patch("http://localhost:5000/user/removeFriend", {
                    friendId: friendId
                }, {
                    withCredentials: true
                })

                setIsFriend("Add Friend");
            }
            else if (isFriend === "Add Friend") {
                const res = await axios.patch("http://localhost:5000/user/addFriend", {
                    friendsId: friendId
                }, {
                    withCredentials: true
                })

                setIsFriend("Request Pending")
            }
            else if (isFriend === "Accept Friend Request") {
                const res = await axios.patch("http://localhost:5000/user/acceptFriendRequest", {
                    friendId: friendId
                }, {
                    withCredentials: true
                })

                setIsFriend("Unfriend")
            }

            getFriends();
            getPendingRequests();
            getRequestSent();
        }
        catch (err) {
            console.log(err.message);
        }
    }

    console.log(currentUser);

    const formatDate = (isoString) => {
        const date = new Date(isoString); // Parse ISO string
        const day = String(date.getDate()).padStart(2, '0');    // Ensure 2 digits
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = String(date.getFullYear()).slice(2);       // Get last two digits of the year
        return `${day}/${month}/${year}`; // Format as dd/mm/yy
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#141414] text-white">
            <Navbar />

            <div className="max-w-4xl mx-auto flex-col p-6">
                <h1 className="mb-10 text-4xl mx-auto font-bold text-center  text-white">Profile</h1>

                {/* Profile Card */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-6">
                        <img
                            src={profileimage}
                            alt={`profile-${user.fullname}`}
                            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                        />
                        <div>
                            <p className="text-2xl font-semibold text-white">{user.fullname}</p>
                            <p className="text-sm text-gray-400">
                                {user.gender || "Not Provided"}
                            </p>
                        </div>
                    </div>

                    <IconBtn text={isFriend} onClick={onClickFriendHandler} />
                </div>

                {/* Personal Details */}
                <div className="my-10 bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xl font-semibold text-white">Personal Details</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-200">
                        <div>
                            <p className="text-sm text-gray-400">Name</p>
                            <p className="text-lg font-medium">{user.fullname}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Gender</p>
                            <p className="text-lg font-medium">
                                {user.gender || "Not Provided"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Date of Birth</p>
                            <p className="text-lg font-medium">{formatDate(user.dob) || "Not Provided"}</p>
                        </div>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-gray-400">About</p>
                        <p className="text-lg text-white font-medium">{user.about}</p>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xl font-semibold text-white">Account Settings</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-200">
                        <div>
                            <p className="text-sm text-gray-400">Email</p>
                            <p className="text-lg font-medium">{user.email || "Not Provided"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Phone Number</p>
                            <p className="text-lg font-medium">{user.phone_number || "Not Provided"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">User ID</p>
                            <p className="text-lg font-medium">
                                {user.username || "Not Provided"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* MODALS */}
                {showPersonalModal && (
                    <EditPersonalDetailsModal
                        onClose={() => setShowPersonalModal(false)}
                        user={user}
                    />
                )}
                {/* {showAccountModal && (
                    <EditAccountSettingsModal
                        onClose={() => setShowAccountModal(false)}
                        user={user}
                    />
                )} */}
            </div>
        </div>
    );
}

