import { useState } from "react";
import { Plus } from "lucide-react";

const MediaCard = ({ media }) => {
    const [open, setOpen] = useState(false);
    const imageUrl = media.primaryImage;
    const hasImage = !!imageUrl;
    const [showTooltip, setShowTooltip] = useState(false);


    return (
        <>
            {/* Card */}
            <div
                className="h-60 w-full rounded-2xl relative shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 group"
                onClick={() => setOpen(true)}
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
                <div className="absolute top-3 right-3 z-10">
                    <div className="relative">
                        <button
                            // onClick={() => setOpen(true)}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition relative"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <Plus size={20} />
                        </button>

                        {/* Tooltip */}
                        {showTooltip && (
                            <div className="absolute left-1/2 -translate-x-[80%] top-[110%] bg-black text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-50">
                                Add to Watchlist
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Modal */}
            {open && (
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
            )}
        </>
    );
};

export default MediaCard;
