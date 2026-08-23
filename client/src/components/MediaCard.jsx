import { useEffect, useState, useRef } from "react";
import { Plus } from "lucide-react";
import axios from "axios";

const MediaCard = ({ media, mediaId, activeModalId, setActiveModalId }) => {
  const imageUrl = media.primaryImage;
  const hasImage = !!imageUrl;
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [modalPos, setModalPos] = useState({ top: 0, left: 0 });
  const plusButtonRef = useRef(null);
  const isModalOpen = activeModalId === mediaId;
  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const [watchlists, setWatchlists] = useState([]);
  const modalRef = useRef(null);

  const handlePlusClick = (e) => {
    e.stopPropagation();
    if (plusButtonRef.current) {
      const rect = plusButtonRef.current.getBoundingClientRect();
      setModalPos({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 12,
      });
      setActiveModalId(mediaId);
    }
  };

  const getAllWatchList = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/watchlist/`,
        { withCredentials: true },
      );
      setWatchlists(res.data.watchlists);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const addToWatchlist = async (id) => {
    setFeedback({ type: null, message: "" });
    // console.log(id)
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/watchlist/addToWatchlist/${id}`,
        { item: media },
        { withCredentials: true },
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
    getAllWatchList();
    const handleClickOutside = (e) => {
      if (
        !plusButtonRef.current?.contains(e.target) &&
        !modalRef.current?.contains(e.target)
      ) {
        setActiveModalId(null);
      }
    };

    if (isModalOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      {/* Media Card */}
      <div
        onClick={() => setOpen(true)}
        className="relative h-60 w-full rounded-2xl overflow-hidden shadow-md cursor-pointer group transform transition-transform hover:scale-105 duration-300"
      >
        {hasImage ? (
          <img
            src={imageUrl}
            alt={media.primaryTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-semibold">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 text-white z-10">
          <h3 className="text-lg font-bold drop-shadow">
            {media.primaryTitle}
          </h3>
        </div>

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
              <Plus size={20} className="text-gray-700" />
            </button>
            {showTooltip && (
              <div className="absolute top-[115%] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md shadow-lg animate-fade-in">
                Add to Watchlist
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Watchlist Modal */}
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
            {watchlists.map((wl) => (
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
                            ${feedback.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
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

      {/* Detailed Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-4 text-black text-xl font-bold hover:text-red-600"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{media.primaryTitle}</h2>
            <div className="space-y-3 text-sm text-gray-800">
              <p>
                <span className="font-semibold">Genres:</span>{" "}
                {media.genres?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Languages:</span>{" "}
                {media.spokenLanguages?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Country:</span>{" "}
                {media.countriesOfOrigin?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Type:</span>{" "}
                {media.type || "N/A"}
              </p>
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                View on IMDb
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaCard;
