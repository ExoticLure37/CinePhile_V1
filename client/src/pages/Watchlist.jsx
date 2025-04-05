import React, { useState } from "react";
import Footer from "../components/Footer";
import LinkNavbar from "../components/LinkNavbar";
import Navbar from "../components/Navbar";
import { FaPlus, FaTimes, FaEdit } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';

function Watchlist() {
    const [showModal, setShowModal] = useState(false);
    const [manageModal, setManageModal] = useState(null);
    const [watchlistType, setWatchlistType] = useState("");
    const [watchlists, setWatchlists] = useState({});

    const handleAddWatchlist = () => {
        if (watchlistType && !watchlists[watchlistType]) {
            setWatchlists({ ...watchlists, [watchlistType]: [] });
            setWatchlistType("");
            setShowModal(false);
        }
    };

    const handleAddToWatchlist = (type, item) => {
        setWatchlists({
            ...watchlists,
            [type]: [...watchlists[type], item],
        });
    };

    // console.log(searchResults)

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
                            onClick={() => setShowModal(true)}
                        >
                            <FaPlus /> Add Watchlist
                        </button>

                        <div className="mt-6 w-full max-w-5xl bg-[#1F1F1F] p-6 rounded-xl shadow-xl border border-gray-700">
                            {Object.keys(watchlists).map((type, index) => (
                                <div key={type} className="flex justify-between my-2 items-center p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#3A3A3A] transition-all shadow-sm border border-gray-600">
                                    <div className="flex gap-3">
                                        <span className="text-lg font-semibold">{index + 1}.</span>
                                        <h2 className="text-lg font-semibold">{type}</h2>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setManageModal(type)} className="text-xl text-gray-300 hover:text-white">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => setManageModal(type)} className="text-red-500 hover:text-red-300">
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
                        <div className="bg-gray-900 p-6 rounded-lg shadow-2xl w-3/5 flex flex-col items-center border border-gray-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Create a Watchlist</h2>

                            {/* Input Field */}
                            <input
                                type="text"
                                placeholder="Enter Watchlist Type"
                                className="w-4/5 p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
                                value={watchlistType}
                                onChange={(e) => setWatchlistType(e.target.value)}
                            />

                            {/* Buttons */}
                            <div className="flex justify-end w-full gap-4 mt-6">
                                <button
                                    className="bg-red-500 px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-green-500 px-7 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                                    onClick={handleAddWatchlist}
                                >
                                    Add
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
                                Manage <span className="text-green-400">{manageModal}</span>
                            </h2>

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
