import React, { cache, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeCard from "./HomeCard";
import Skeleton from "./Skeleton";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCachedResults } from "../redux/cachedResults/cachedResultsSlice";

function MediaCarousel({ title, endpoint, params = {}, navigateTo, flag, normalizeData, cacheKey }) {
    const [mediaItems, setMediaItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 6;
    const [activeModalId, setActiveModalId] = useState(null);
    const navigate = useNavigate();
    const cachedResults = useSelector((state) => state.cachedResults);

    const dispatch = useDispatch();

    // console.log(cachedResults);

    useEffect(() => {
        // Only run on mount
        if (cachedResults[cacheKey]?.length > 0) {
            setMediaItems(cachedResults[cacheKey]);
        } else {
            fetchMedia();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount


    const fetchMedia = async () => {
        try {
            const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
            const apiHost = process.env.REACT_APP_RAPIDAPI_HOST;

            const response = await axios.get(endpoint, {
                params,
                headers: {
                    "x-rapidapi-key": apiKey,
                    "x-rapidapi-host": apiHost,
                },
            });

            const rawData = response.data;
            const items = normalizeData(rawData);
            setMediaItems(items.slice(0, 30));
            dispatch(setCachedResults({ [cacheKey]: items.slice(0, 30) }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleNavigate = () => {
        navigate(navigateTo, { state: { f: flag } });
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - itemsPerPage);
        }
    };

    const handleNext = () => {
        if (currentIndex + itemsPerPage < mediaItems.length) {
            setCurrentIndex((prev) => prev + itemsPerPage);
        }
    };

    return (
        <div className="flex flex-col gap-5 relative">
            {(mediaItems.length === 0) ? (
                <Skeleton />
            ) : (
                <>
                    <button
                        onClick={handleNavigate}
                        className="font-bold text-4xl hover:text-5xl text-left transition-all duration-200"
                    >
                        {title} <ArrowForwardIosIcon />
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="text-white hover:scale-125 transition-all duration-300 p-2 disabled:opacity-30"
                        >
                            <ChevronLeftIcon fontSize="large" />
                        </button>

                        <div className="flex gap-8 transition-all duration-300">
                            {mediaItems
                                .slice(currentIndex, currentIndex + itemsPerPage)
                                .map((item) => (
                                    <HomeCard
                                        key={item.id}
                                        media={{
                                            ...item,
                                            primaryImage: item.primaryImage || null,
                                            primaryTitle: item.originalTitle || "No Title",
                                            genres: item.genres || [],
                                            spokenLanguages: item.spokenLanguages || ["en"],
                                            countriesOfOrigin: item.countriesOfOrigin || [],
                                            url: `https://www.imdb.com/title/${item.id}`,
                                            type: item.titleType || "movie",
                                        }}
                                        mediaId={item.id}
                                        activeModalId={activeModalId}
                                        setActiveModalId={setActiveModalId}
                                    />
                                ))}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={currentIndex + itemsPerPage >= mediaItems.length}
                            className="text-white hover:scale-125 transition-all duration-300 p-2 disabled:opacity-30"
                        >
                            <ChevronRightIcon fontSize="large" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default MediaCarousel;
