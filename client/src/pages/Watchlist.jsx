import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import LinkNavbar from "../components/LinkNavbar";
import Navbar from "../components/Navbar";
import { FaPlus, FaTimes, FaEdit } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import WatchlistCard from "../components/WatchlistCard";

function Watchlist() {
    const [showModal, setShowModal] = useState(false);
    const [manageModal, setManageModal] = useState(null);
    const [currentWatchlist, setCurrentWatchlist] = useState();
    const [watchlistType, setWatchlistType] = useState("");
    const [watchlists, setWatchlists] = useState([]);
    const [visibleResults, setVisibleResults] = useState(10);
    const [activeModalId, setActiveModalId] = useState(null);

    useEffect(() => {
        getAllWatchList();
    }, [])

    const getAllWatchList = async () => {
        try {
            const res = await axios.get("http://localhost:5000/watchlist/", { withCredentials: true });

            setWatchlists(res.data.watchlists);
            // console.log(res.data);
        }
        catch (err) {
            console.log(err.response.data);
        }
    }

    const handleAddWatchlist = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/watchlist/create/${watchlistType}`, {}, {
                withCredentials: true
            })

            setWatchlists(res.data.watchlists);
            setShowModal(false);
            // console.log(res.data);
        }
        catch (err) {
            console.log(err.response.data);
        }
    };

    const deleteWatchlist = async (id) => {
        try {
            // console.log(id);
            const res = await axios.delete(`http://localhost:5000/watchlist/delete/${id}`, { withCredentials: true })

            setWatchlists(res.data.updatedWatchlists);
        }
        catch (err) {
            console.log(err.response.data)
        }
    }

    const getWatclistDetail = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/watchlist/${id}`, { withCredentials: true });
            setCurrentWatchlist(res.data.items);
            // console.log(res.data.items)
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#141414] text-white">
            <div className="flex-grow">
                <div className={`${manageModal || showModal ? "blur-sm" : ""} transition duration-300`}>
                    <Navbar />
                    <div className="bg-slate-200 bg-opacity-20 sticky top-0 z-40">
                        <LinkNavbar />
                    </div>


                    <div className="flex flex-col gap-4 items-center p-6 flex-grow">
                        <h1 className="text-4xl font-extrabold mb-2 text-gray-200">Watchlist</h1>
                        <button
                            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                            onClick={() => {
                                setShowModal(true);
                            }}
                        >
                            <FaPlus /> Add Watchlist
                        </button>

                        <div className="mt-6 w-full max-w-5xl bg-gradient-to-br from-[#1F1F1F] to-[#2A2A2A] p-8 rounded-2xl shadow-2xl border border-gray-700">
                            {watchlists.length === 0 ? (
                                <div className="text-center text-gray-400 text-lg py-6">No watchlists created yet.</div>
                            ) : (
                                watchlists.map((type, index) => (
                                    <div
                                        key={type._id || index}
                                        className="flex justify-between items-center p-5 my-4 rounded-xl bg-gradient-to-r from-[#2a2a2a] via-[#252525] to-[#1c1c1c] hover:from-[#333333] hover:to-[#292929] transition-all duration-300 shadow-lg border border-gray-600 hover:scale-[1.01]"
                                    >
                                        <div className="flex gap-4 items-center">
                                            <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-inner">
                                                #{index + 1}
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-100 tracking-wide">{type.title}</h2>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setManageModal(true);
                                                    getWatclistDetail(type._id);
                                                }}
                                                className="text-yellow-400 hover:text-yellow-300 transition transform hover:scale-110"
                                                title="Edit Watchlist"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteWatchlist(type._id)}
                                                className="text-red-500 hover:text-red-400 transition transform hover:scale-110"
                                                title="Delete Watchlist"
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl w-11/12 max-w-xl border border-gray-700 animate-fade-in">
                            {/* Title */}
                            <h2 className="text-3xl font-bold text-white mb-6 tracking-wide text-center">
                                ✨ Create a Watchlist
                            </h2>

                            {/* Input Field */}
                            <input
                                type="text"
                                placeholder="Enter watchlist name..."
                                className="w-full px-5 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 shadow-inner"
                                value={watchlistType}
                                onChange={(e) => setWatchlistType(e.target.value)}
                            />

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-200 shadow-md"
                                    onClick={() => setShowModal(false)}
                                >
                                    ✖ Cancel
                                </button>
                                <button
                                    className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-semibold transition duration-200 shadow-md"
                                    onClick={handleAddWatchlist}
                                >
                                    ➕ Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                {manageModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
                        {/* Modal Content */}
                        <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-2xl w-3/5 flex flex-col items-center border border-gray-700">
                            <h2 className="text-xl font-bold text-white mb-4">
                                Manage <span className="text-green-400">Watchlist</span>
                            </h2>

                            {currentWatchlist?.length > 0 && (
                                <div className="mt-6 max-h-[25rem] overflow-y-auto bg-gray-800 p-5 rounded-xl shadow-inner w-full border border-gray-700 transition-all">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {currentWatchlist.slice(0, visibleResults).map((item) => (
                                            <WatchlistCard
                                                key={item.imdb_id}
                                                media={{
                                                    ...item,
                                                    primaryImage: item.imageUrl,
                                                    primaryTitle: item.name || "No Title",
                                                    url: `https://www.imdb.com/title/${item.imdb_id}`,
                                                }}
                                                mediaId={item.imdb_id} activeModalId={activeModalId}
                                                setActiveModalId={setActiveModalId}
                                            />
                                        ))}
                                    </div>

                                    {/* Load More Button */}
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
                            )}

                            {/* Close Button */}
                            <div className="flex justify-end w-full mt-4">
                                <button
                                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                                    onClick={() => {
                                        setManageModal(null);
                                        // setSearchQuery("");
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
            <Footer className="w-full" />
        </div>
    );
}

export default Watchlist;
