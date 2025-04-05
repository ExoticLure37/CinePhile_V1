import { useEffect, useState, useRef } from "react";
import { Plus } from "lucide-react";
import axios from "axios";

const MediaCard = ({ media, mediaId, activeModalId, setActiveModalId }) => {
    const imageUrl = media.primaryImage;
    const hasImage = !!imageUrl;
    const [open, setOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showWatchlistModal, setShowWatchlistModal] = useState(false);
    const [modalPos, setModalPos] = useState({ top: 0, left: 0 });
    const plusButtonRef = useRef(null);
    const isModalOpen = activeModalId === mediaId;

    const [watchlists, setWatchlists] = useState([]);

    const handlePlusClick = (e) => {
        e.stopPropagation();
        setShowWatchlistModal(false);

        if (plusButtonRef.current) {
            const rect = plusButtonRef.current.getBoundingClientRect();
            setModalPos({
                top: rect.top + window.scrollY,     // makes sure it tracks scroll
                left: rect.right + window.scrollX + 8, // +8 for gap from button
            });
            setActiveModalId(mediaId);
        }
    };

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

    const addToWatchlist = async (id) => {
        try {
            console.log(media)
            const res = await axios.patch(`http://localhost:5000/watchlist/addToWatchlist/${id}`, { item: media }, { withCredentials: true });
            console.log(res.data);
        }
        catch (err) {
            console.log(err.response.data);
        }
    }

    // Close on outside click
    useEffect(() => {
        getAllWatchList();
        const handleClickOutside = (e) => {
            if (!plusButtonRef.current?.contains(e.target)) {
                setShowWatchlistModal(false);
            }
        };

        if (showWatchlistModal) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isModalOpen, watchlists]);

    return (
        <>
            {/* Card */}
            <div onClick={() => setOpen(true)}
                className="h-60 w-full rounded-2xl relative shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 group"
            >
                {/* Image or Skeleton */}
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={media.primaryTitle}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 animate-pulse flex items-center justify-center text-white text-sm font-medium">
                        No Image Available
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent rounded-2xl" />

                {/* Title */}
                <div className="absolute bottom-3 left-3 z-10">
                    <h3 className="text-white text-xl font-bold drop-shadow-sm">
                        {media.primaryTitle}
                    </h3>
                </div>

                {/* Plus Button with Tooltip */}
                <div
                    className="absolute top-3 right-3 z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative">
                        <button
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
                            ref={plusButtonRef}
                            onClick={handlePlusClick}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <Plus size={20} className="text-gray-600" />
                        </button>

                        {/* Tooltip */}
                        {showTooltip && (
                            <div className="absolute left-1/2 -translate-x-[80%] top-[110%] bg-black text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-50">
                                Add to Watchlist
                            </div>
                        )}
                    </div>
                </div>

            </div >

            {/* Detached Watchlist Modal */}
            {isModalOpen && (
                <div
                    className="absolute z-[9999] w-60 rounded-xl border border-gray-600 bg-gray-900 shadow-2xl p-4 animate-fade-in"
                    style={{
                        top: modalPos.top,
                        left: modalPos.left,
                        position: "absolute",
                    }}
                >
                    <h4 className="text-gray-100 text-base font-semibold mb-3">
                        Select Watchlist
                    </h4>

                    <ul className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        {watchlists.map((wl) => (
                            <li
                                key={wl._id}
                                onClick={() => { addToWatchlist(wl._id) }}
                                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all cursor-pointer"
                            >
                                {wl.title}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 border-t border-gray-700 pt-3 text-right">
                        <button
                            onClick={() => setActiveModalId(null)}
                            className="text-xs text-red-400 font-medium hover:text-red-300 transition"
                        >
                            ✕ Close
                        </button>
                    </div>
                </div>
            )}



            {/* Modal */}
            {
                open && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                            {/* Close Button */}
                            <button
                                className="absolute top-3 right-4 text-black font-bold text-xl hover:text-red-600 transition"
                                onClick={() => setOpen(false)}
                            >
                                ✕
                            </button>

                            {/* Modal Content */}
                            <h2 className="text-2xl font-bold mb-4">{media.primaryTitle}</h2>
                            <div className="space-y-3 text-sm text-gray-800">
                                <p><span className="font-semibold">Genres:</span> {media.genres?.join(', ') || 'N/A'}</p>
                                <p><span className="font-semibold">Languages:</span> {media.spokenLanguages?.join(', ') || 'N/A'}</p>
                                <p><span className="font-semibold">Country:</span> {media.countriesOfOrigin?.join(', ') || 'N/A'}</p>
                                <p><span className="font-semibold">Type:</span> {media.type || 'N/A'}</p>
                                <a
                                    href={media.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800 transition"
                                >
                                    View on IMDb
                                </a>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default MediaCard;
