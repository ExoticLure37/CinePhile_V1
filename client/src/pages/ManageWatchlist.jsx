import React, { useEffect, useState } from 'react'
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
    const [watchListId, setWatchlistsId] = useState();

    const location = useLocation();
    const watchlist_id = location.state?.wt;

    // console.log(watchlist)

    useEffect(() => {
        getWatchlistDetail();
    }, []);

    const getWatchlistDetail = async () => {
        console.log(watchlist_id);
        try {
            const res = await axios.get(`http://localhost:5000/watchlist/${watchlist_id}`, { withCredentials: true });
            setCurrentWatchlist(res.data.items);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#0f0f0f] via-[#1c1c1c] to-[#141414] text-white">
            {/* Sticky Navbar */}
            <Navbar />
            <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40">
                <LinkNavbar />
            </div>

            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-[1440px] min-h-[600px] bg-[#111] p-10 rounded-2xl shadow-2xl border border-gray-800">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        Manage <span className="text-green-400">Watchlist</span>
                    </h2>

                    {currentWatchlist?.length > 0 ? (
                        <div className="mt-4 max-h-[32rem] overflow-y-auto bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
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
                                        mediaImdbId={item.imdb_id}
                                        activeModalId={activeModalId}
                                        setActiveModalId={setActiveModalId}
                                        watchListId={watchListId}
                                        mediaId={item._id}
                                        onRemove={() => getWatchlistDetail(watchlist_id)}
                                    />
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

            {/* Footer always at bottom */}
            <Footer />
        </div>
    );
}


export default ManageWatchlist