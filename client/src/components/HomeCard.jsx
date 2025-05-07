import { useEffect, useState, useRef } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import BlurredImageSides from "./BlurredImageSides";
import { FaPlayCircle } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";

const HomeCard = ({ media, mediaId, activeModalId, setActiveModalId }) => {
  const imageUrl = media.primaryImage;
  const hasImage = !!imageUrl;
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [modalPos, setModalPos] = useState({ top: 0, left: 0 });
  const plusButtonRef = useRef(null);
  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const isModalOpen = activeModalId === mediaId;
  const [watchlists, setWatchlists] = useState([]);
  const modalRef = useRef(null);

  const handlePlusClick = (e) => {
    e.stopPropagation();
    setShowWatchlistModal(false);

    if (plusButtonRef.current) {
      const rect = plusButtonRef.current.getBoundingClientRect();
      setModalPos({
        top: rect.top,
        left: rect.right + 9, // +8 for gap from button
      });
      setActiveModalId(mediaId);
    }
  };

  const addToWatchlist = async (id) => {
    setFeedback({ type: null, message: "" });
    // console.log(id)
    try {
      await axios.patch(
        `http://localhost:5000/watchlist/addToWatchlist/${id}`,
        { item: media },
        { withCredentials: true }
      );
      setFeedback({ type: "success", message: "Added to watchlist ✅" });
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong!";
      setFeedback({ type: "error", message: msg });
    }

    setTimeout(() => {
      setFeedback({ type: null, message: "" });
    }, 3000);
  };

  useEffect(() => {
    // console.log(media)
    getAllWatchList();
  }, []);

  const getAllWatchList = async () => {
    try {
      const res = await axios.get("http://localhost:5000/watchlist/", {
        withCredentials: true,
      });
      setWatchlists(res.data.watchlists);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  // Close on outside click
  useEffect(() => {
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
  }, [isModalOpen]);

  // Close on outside click
  useEffect(() => {
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
  }, [isModalOpen]);

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setOpen(true)}
        className="h-60 w-48 rounded-2xl relative shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 group"
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
            {/* <button
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
                            ref={plusButtonRef}
                            onClick={handlePlusClick}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <Plus size={20} className="text-gray-600" />
                        </button> */}

            {/* Tooltip */}
            {/* {showTooltip && (
                            <div className="absolute left-1/2 -translate-x-[80%] top-[110%] bg-black text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-50">
                                Add to Watchlist
                            </div>
                        )} */}
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#1a1a1a]/90 rounded-2xl max-w-[140vh] w-[95vw] shadow-[0_8px_30px_rgb(0,0,0,0.25)] relative max-h-[90vh] overflow-y-auto scrollbar-hide border border-gray-700">
            {/* Background Image / Blurred */}
            <BlurredImageSides image={media.primaryImage} />

            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-white font-bold text-2xl hover:text-red-500 transition-all duration-200 z-10"
              onClick={() => {
                setOpen(false);
                setActiveModalId(null);
              }}
            >
              ✕
            </button>

            {/* IMDb Button */}
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md left-4 top-[52vh] z-10 transition"
            >
              <FaPlayCircle className="text-lg" /> View on IMDb
            </a>

            {/* Plus Button with Tooltip */}
            <div
              className="absolute right-[89vh] top-[51.5vh] z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  className="p-2 rounded-full bg-black/30 hover:bg-white/20 transition backdrop-blur-md shadow-md"
                  ref={plusButtonRef}
                  onClick={handlePlusClick}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <BsPlusCircle className="text-white text-3xl" />
                </button>

                {showTooltip && (
                  <div className="absolute left-[18vh] -translate-x-[80%] top-[110%] bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg z-50 whitespace-nowrap">
                    Add to Watchlist
                  </div>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col px-8 pt-4 pb-6 space-y-4 text-white">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-4xl font-extrabold tracking-tight">
                  {media.primaryTitle}
                </h2>
                <a
                  className="flex items-center gap-2 text-lg text-red-400 hover:text-red-500 transition"
                  href={media.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaPlayCircle className="text-xl" /> Watch Trailer
                </a>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {media.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-sm text-gray-300 pt-2">
                <p>
                  <span className="font-semibold text-white">Genres:</span>{" "}
                  {media.genres?.join(", ") || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-white">Languages:</span>{" "}
                  {media.spokenLanguages?.join(", ") || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-white">Country:</span>{" "}
                  {media.countriesOfOrigin?.join(", ") || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-white">Type:</span>{" "}
                  {media.type || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-white">
                    Release Date:
                  </span>{" "}
                  {media.releaseDate || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          ref={modalRef}
          className="absolute z-[9999] w-64 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl p-4 animate-slide-up"
          style={{
            top: modalPos.top,
            left: modalPos.left,
          }}
        >
          <h4 className="text-white font-semibold text-sm mb-3">
            Select Watchlist
          </h4>
          <ul className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {watchlists &&
              Array.isArray(watchlists) &&
              watchlists.map((wl) => (
                <li
                  key={wl._id}
                  onClick={() => addToWatchlist(wl.watchlist_id)}
                  className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer transition"
                >
                  {wl.title}
                </li>
              ))}
          </ul>

          <div className="mt-4 pt-3 text-right border-t border-gray-700 relative">
            {feedback.type && (
              <div
                className={`absolute top-[-2.5rem] right-0 px-4 py-2 rounded-md text-sm font-semibold shadow-lg transition-all animate-slide-down
                            ${
                              feedback.type === "success"
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
              >
                {feedback.message}
              </div>
            )}
            <button
              onClick={() => setActiveModalId(null)}
              className="text-xs text-red-400 hover:text-red-300 transition"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeCard;
