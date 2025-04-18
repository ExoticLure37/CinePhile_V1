import React, { useEffect, useState } from 'react';
import WatchlistCard from '../components/WatchlistCard';
import axios from 'axios';
import LinkNavbar from '../components/LinkNavbar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

function ManageWatchlist() {
    const [visibleResults, setVisibleResults] = useState(10);
    const [activeModalId, setActiveModalId] = useState(null);
    const [currentWatchlist, setCurrentWatchlist] = useState();
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [friendList, setFriendList] = useState([]);

    const location = useLocation();
    const watchlist = location.state?.wt;

    useEffect(() => {
        getWatchlistDetail();
        getFriends();
    }, []);

    const getFriends = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user/getFriends", {
                withCredentials: true
            })

            // setFriendList({ friendList: res.data.friendList });
            setFriendList(res.data.friendList);
            // console.log(res.data.friendList);
        }
        catch (err) {
            console.log(err);
        }
    }

    // console.log(friendList)

    const getWatchlistDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/watchlist/${watchlist.watchlist_id}`, { withCredentials: true });
            setCurrentWatchlist(res.data.watchList.items);
            // console.log(res.data.watchList.items);
        } catch (err) {
            console.log(err);
        }
    };

    const addMember = async (id) => {
        try {
            await axios.post(`http://localhost:5000/watchlist/shared/add-member/${watchlist.watchlist_id}`,{})
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#0f0f0f] via-[#1c1c1c] to-[#141414] text-white">
            <Navbar />
            <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40">
                <LinkNavbar />
            </div>

            {/* Main Section */}
            <div className="flex-grow flex justify-center px-4 py-10">
                <div className="w-full max-w-[1440px] min-h-[600px] flex gap-6">
                    {/* Left: Members Block */}
                    <div className="w-[25%] bg-[#1b1b1b] border border-gray-800 p-6 rounded-2xl shadow-lg flex flex-col">
                        <h3 className="text-xl font-bold text-green-400 mb-6 text-center border-b border-gray-700 pb-2">
                            Members
                        </h3>

                        <ul className="space-y-4 text-gray-200 text-sm flex-grow overflow-y-auto">
                            <li className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-semibold">Y</div>
                                You (Owner)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gray-600 text-white text-xs flex items-center justify-center font-semibold">J</div>
                                john_doe
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gray-600 text-white text-xs flex items-center justify-center font-semibold">J</div>
                                jane_smith
                            </li>
                        </ul>

                        <button
                            onClick={() => setShowAddMemberModal(true)}
                            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            + Add Member
                        </button>
                    </div>



                    {/* Right: Watchlist Block */}
                    <div className="flex-grow bg-[#111] p-10 rounded-2xl shadow-2xl border border-gray-800">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">
                            Manage <span className="text-green-400">Watchlist</span>
                        </h2>

                        {currentWatchlist?.length > 0 ? (
                            <div className="mt-4 max-h-[32rem] overflow-y-auto bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {currentWatchlist.slice(0, visibleResults).map((item) => (
                                        <div className="border border-gray-700 p-4 rounded-xl bg-[#202020] shadow-inner">
                                            <WatchlistCard
                                                key={item.imdb_id}
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
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
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
            </div>

            {showAddMemberModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
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
                                        <button onClick={() => addMember(friend._id._id)} className="px-3 py-1 text-sm font-medium bg-green-600 hover:bg-green-700 rounded-md transition">
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

            <Footer />
        </div>
    );
}

export default ManageWatchlist;
