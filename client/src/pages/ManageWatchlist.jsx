import React, { useEffect, useState } from 'react';
import WatchlistCard from '../components/WatchlistCard';
import axios from 'axios';
import LinkNavbar from '../components/LinkNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

function ManageWatchlist() {
    const [visibleResults, setVisibleResults] = useState(10);
    const [activeModalId, setActiveModalId] = useState(null);
    const [currentWatchlist, setCurrentWatchlist] = useState();
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [friendList, setFriendList] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [permissions, setPermissions] = useState({
        canEdit: false,
        canAdd: false,
        canRemove: false,
    });
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [memberList, setMemberList] = useState([]);
    const [isMembersPanelVisible, setIsMembersPanelVisible] = useState(false);

    const location = useLocation();
    const watchlist = location.state?.wt;

    useEffect(() => {
        getWatchlistDetail();
        getFriends();
    }, []);

    // console.log(selectedFriend)

    const getFriends = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user/getFriends", {
                withCredentials: true
            });
            setFriendList(res.data.friendList);
        } catch (err) {
            console.log(err.response);
        }
    };

    const getWatchlistDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/watchlist/${watchlist.watchlist_id}`, {
                withCredentials: true
            });
            setCurrentWatchlist(res.data.watchList.items);
            setMemberList(res.data.watchList.members);
            console.log(res.data.watchList.members)
        } catch (err) {
            console.log(err);
        }
    };

    const addMember = async (memberId) => {
        try {
            if (showPermissionModal === "Add") {
                await axios.patch(`http://localhost:5000/watchlist/shared/${watchlist.watchlist_id}/members`, {
                    memberId: selectedFriend._id._id,
                    permissions
                }, {
                    withCredentials: true
                });
            }
            else {
                await axios.patch(`http://localhost:5000/watchlist/shared/${watchlist.watchlist_id}/members/${memberId}/permissions`, { permissions }, {
                    withCredentials: true
                })
            }

            getWatchlistDetail();
            setShowPermissionModal(false);
        } catch (err) {
            console.log(err);
        }
    };

    const removeMember = async (memberId) => {
        try {
            await axios.patch(`http://localhost:5000/watchlist/shared/${watchlist.watchlist_id}/members/${memberId}`, {}, {
                withCredentials: true
            })

            getWatchlistDetail();
        }
        catch (err) {
            console.log(err.response)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#111] via-[#181818] to-[#141414] text-white">
            <Navbar />
            <div className="bg-black/60 backdrop-blur-md sticky top-0 z-40">
                <LinkNavbar />
            </div>

            {/* Members Panel Trigger (hover area) */}
            <div
                className="fixed top-[200px] right-0 z-[998] w-[40px] h-[80px] bg-blue-700 rounded-l-xl cursor-pointer flex items-center justify-center hover:w-[45px]"
                onMouseEnter={() => setIsMembersPanelVisible(true)}
            >
                <span className="text-white font-bold text-lg">≡</span>
            </div>

            {/* Members Side Panel */}
            {isMembersPanelVisible && (
                <div
                    className={`fixed top-[100px] right-0 z-[999] w-[320px] bg-[#1a1a1a] border border-gray-800 p-6 rounded-l-2xl shadow-lg flex flex-col h-[80vh] 
            transition-transform duration-500 ease-in-out transform ${isMembersPanelVisible ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    onMouseEnter={() => setIsMembersPanelVisible(true)}
                    onMouseLeave={() => setIsMembersPanelVisible(false)}
                >
                    <h3 className="text-xl font-bold text-green-400 mb-6 text-center border-b border-gray-700 pb-2">
                        Members
                    </h3>

                    <ul className="space-y-4 text-gray-200 text-sm flex-grow overflow-y-auto">
                        <li className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-semibold">Y</div>
                            You (Owner)
                        </li>
                        {memberList.map((item) => (
                            <li key={item._id} className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center font-semibold">J</div>
                                {item.user_id.username}

                                <div className='ml-auto'>
                                    <button onClick={() => {
                                        setShowPermissionModal("Edit");
                                        setPermissions(item.permissions);
                                        setSelectedFriend(item);
                                    }} className='text-end ml-auto hover:text-gray-400'>
                                        <EditIcon />
                                    </button>

                                    <button onClick={() => removeMember(item.user_id._id)} className='text-end hover:text-gray-400'>
                                        <PersonRemoveIcon />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => setShowAddMemberModal("Add")}
                        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        + Add Member
                    </button>
                </div>
            )}

            {/* Watchlist Block (takes full width) */}
            <div className="flex-grow w-full px-4 py-10">
                <div className="w-full max-w-[1440px] mx-auto bg-[#111] p-10 rounded-2xl shadow-2xl border border-gray-800">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        Manage <span className="text-green-400">Watchlist</span>
                    </h2>

                    {currentWatchlist?.length > 0 ? (
                        <div className="mt-4 max-h-[32rem] overflow-y-auto bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                                {currentWatchlist.slice(0, visibleResults).map((item) => (
                                    <div key={item.imdb_id} className="border border-gray-700 p-4 rounded-xl bg-[#202020] shadow-inner">
                                        <WatchlistCard
                                            media={{
                                                ...item,
                                                primaryImage: item.imageUrl,
                                                primaryTitle: item.name || "No Title",
                                                url: `https://www.imdb.com/title/${item.imdb_id}`,
                                            }}
                                            mediaImdbId={item.imdb_id}
                                            activeModalId={activeModalId}
                                            setActiveModalId={setActiveModalId}
                                            watchListId={watchlist.watchlist_id}
                                            mediaId={item._id}
                                            onRemove={() => getWatchlistDetail(watchlist.watchlist_id)}
                                        />
                                    </div>
                                ))}
                            </div>
                            {visibleResults < currentWatchlist.length && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                                        onClick={() => setVisibleResults((prev) => prev + 10)}
                                    >
                                        Load More
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7 7 7-7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-6 bg-gray-900 text-gray-300 p-6 rounded-xl border border-gray-700 shadow-inner text-center">
                            <p className="text-lg font-medium">Your watchlist is empty.</p>
                            <p className="text-sm text-gray-400 mt-2">Start adding movies or shows you want to keep track of!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showAddMemberModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
                    <div className="bg-[#1f1f1f] w-full max-w-md p-6 rounded-2xl shadow-2xl border border-gray-700 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center border-b border-gray-700 pb-2">
                            Add Member to Watchlist
                        </h2>

                        {friendList.length > 0 ? (
                            <ul className="space-y-4 mb-6">
                                {friendList.map((friend) => (
                                    <li
                                        key={friend._id}
                                        className="flex items-center justify-between gap-4 bg-[#2a2a2a] p-3 rounded-lg border border-gray-700 hover:shadow-lg transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-semibold">
                                                {friend._id.username[0]?.toUpperCase()}
                                            </div>
                                            <span className="text-white text-sm font-medium">{friend._id.username}</span>
                                        </div>
                                        <button onClick={() => {
                                            setSelectedFriend(friend);
                                            setShowPermissionModal("Add");
                                        }} className="px-3 py-1 text-sm font-medium bg-green-600 hover:bg-green-700 rounded-md transition">
                                            Add
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-400 text-sm text-center mb-6">
                                Friend list is empty.
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAddMemberModal(false)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPermissionModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="bg-gradient-to-b from-[#222] via-[#1c1c1c] to-[#111] w-full max-w-md p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-gray-700">
                        <h2 className="text-2xl font-extrabold text-white mb-6 text-center border-b border-gray-600 pb-3 tracking-wide">
                            Set Permissions for <span className="text-green-400">{selectedFriend?._id?.username}</span>
                        </h2>

                        <div className="space-y-6 mb-8">
                            {[
                                { key: "canEdit", label: "Can Edit Watchlist" },
                                { key: "canAdd", label: "Can Add Items" },
                                { key: "canRemove", label: "Can Remove Items" },
                            ].map(({ key, label }) => (
                                <div key={key} className="flex items-center justify-between bg-[#2b2b2b] px-4 py-3 rounded-lg border border-gray-600 hover:shadow-md transition">
                                    <span className="text-white text-sm font-medium">{label}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={permissions[key]}
                                            onChange={(e) =>
                                                setPermissions((prev) => ({
                                                    ...prev,
                                                    [key]: e.target.checked,
                                                }))
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-500 transition-all duration-300 peer-focus:ring-2 peer-focus:ring-green-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowPermissionModal(false);
                                    setSelectedFriend(null);
                                    setPermissions({ canEdit: false, canAdd: false, canRemove: false });
                                }}
                                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-200 shadow-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => showPermissionModal === "Add" ? addMember() : addMember(selectedFriend.user_id._id)}
                                className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-200 shadow-md"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default ManageWatchlist;