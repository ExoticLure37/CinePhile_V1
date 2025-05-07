// Watchlist.jsx (Refined with enhanced CSS for appeal)
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import LinkNavbar from "../components/LinkNavbar";
import Navbar from "../components/Navbar";
import { FaPlus, FaTimes, FaEdit } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import WatchlistCard from "../components/WatchlistCard";
import { useNavigate } from "react-router-dom";

function Watchlist() {
    const [showModal, setShowModal] = useState(false);
    const [manageModal, setManageModal] = useState(null);
    const [watchlistType, setWatchlistType] = useState("");
    const [watchlists, setWatchlists] = useState([]);

    useEffect(() => {
        getAllWatchList();
    }, [])

    const getAllWatchList = async () => {
        try {
            const res = await axios.get("http://localhost:5000/watchlist/", { withCredentials: true });
            setWatchlists(res.data.watchlists);
            // console.log(res.data.watchlists);
        } catch (err) {
            console.log(err.response?.data);
        }
    }

    const handleAddWatchlist = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/watchlist/create/${watchlistType}`, {}, { withCredentials: true });
            setWatchlists(res.data.watchlists);
            setShowModal(false);
        } catch (err) {
            console.log(err.response?.data);
        }
    };

    const deleteWatchlist = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:5000/watchlist/delete/${id}`, { withCredentials: true });
            setWatchlists(res.data.updatedWatchlists);
        } catch (err) {
            console.log(err.response?.data);
        }
    }

    const navigate = useNavigate();

    const handleNavigate = (watchlist) => {
        console.log(watchlist)
        navigate("/manageWatchlist", { state: { wt: watchlist } });
    };


    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#0f0f0f] via-[#1c1c1c] to-[#141414] text-white text-sm">
            <div className="flex-grow">
                <div className={`${manageModal || showModal ? "blur-sm" : ""} transition duration-300`}>
                    <Navbar />
                    <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40">
                        <LinkNavbar />
                    </div>

                    <div className="flex flex-col gap-4 items-center px-4 py-6">
                        <h1 className="text-3xl font-bold mb-4 text-white drop-shadow-sm">📺 My Watchlists</h1>

                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3.5 rounded-full flex items-center gap-1.5 shadow hover:shadow-md transition duration-300 text-sm"
                            onClick={() => setShowModal(true)}
                        >
                            <FaPlus /> Add Watchlist
                        </button>

                        <div className="mt-6 w-full max-w-5xl bg-[#1c1c1e] p-6 rounded-2xl shadow-xl border border-gray-800">
                            {(watchlists ?? []).length === 0 ? (
                                <div className="text-center text-gray-400 py-8 italic">No watchlists created yet.</div>
                            ) : (
                                watchlists.map((type, index) => (
                                    <div
                                        key={type._id || index}
                                        className="flex justify-between items-center p-4 my-3 rounded-xl bg-gradient-to-r from-[#2a2a2a] via-[#1e1e1e] to-[#141414] hover:from-[#333333] hover:to-[#292929] transition-all duration-300 shadow-md border border-gray-700 hover:scale-[1.01]"
                                    >
                                        <div className="flex gap-3 items-center">
                                            <div className="bg-gray-700 px-2 py-0.5 rounded-full text-xs font-medium shadow-inner">
                                                #{index + 1}
                                            </div>
                                            <h2 className="text-lg font-semibold text-white tracking-tight">{type.title}</h2>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleNavigate(type)}
                                                className="text-yellow-400 hover:text-yellow-300 transition transform hover:scale-110"
                                                title="Edit Watchlist"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteWatchlist(type.watchlist_id)}
                                                className="text-red-500 hover:text-red-400 transition transform hover:scale-110"
                                                title="Delete Watchlist"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-700">
                            <h2 className="text-xl font-bold text-white mb-4 text-center">✨ Create a Watchlist</h2>
                            <input
                                type="text"
                                placeholder="Enter watchlist name..."
                                className="w-full px-4 py-2.5 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                value={watchlistType}
                                onChange={(e) => setWatchlistType(e.target.value)}
                            />
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition"
                                    onClick={() => setShowModal(false)}
                                >✖ Cancel</button>
                                <button
                                    className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium transition"
                                    onClick={handleAddWatchlist}
                                >➕ Add</button>
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