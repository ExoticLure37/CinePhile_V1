import React, { useState } from "react";
import Footer from "../components/Footer";
import LinkNavbar from "../components/LinkNavbar";
import Navbar from "../components/Navbar";
import { FaPlus, FaTimes, FaEdit } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';

function Watchlist() {
    const [showModal, setShowModal] = useState(false);
    const [manageModal, setManageModal] = useState(null);
    const [watchlistType, setWatchlistType] = useState("");
    const [watchlists, setWatchlists] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

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

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        // Mock search results
        const mockResults = [
            "Breaking Bad",
            "Stranger Things",
            "Game of Thrones",
            "The Witcher",
        ].filter((show) => show.toLowerCase().includes(e.target.value.toLowerCase()));
        setSearchResults(mockResults);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#141414] text-white">
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
                                    <DeleteIcon/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Create a Watchlist</h2>
                        <input
                            type="text"
                            placeholder="Enter Watchlist Type"
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            value={watchlistType}
                            onChange={(e) => setWatchlistType(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                                onClick={() => setShowModal(false)}
                            >
                                <FaTimes /> Cancel
                            </button>
                            <button
                                className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                                onClick={handleAddWatchlist}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {manageModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Manage {manageModal}</h2>
                        <input
                            type="text"
                            placeholder="Search for a show or movie..."
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <ul className="mt-3 space-y-2">
                            {searchResults.map((item) => (
                                <li
                                    key={item}
                                    className="flex justify-between bg-gray-700 p-2 rounded-md cursor-pointer hover:bg-gray-600"
                                    onClick={() => handleAddToWatchlist(manageModal, item)}
                                >
                                    {item}
                                    <FaPlus className="text-green-400" />
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                                onClick={() => setManageModal(null)}
                            >
                                <FaTimes /> Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer className="mt-auto" />
        </div>
    );
}

export default Watchlist;
