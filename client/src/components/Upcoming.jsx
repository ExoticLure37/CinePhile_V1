import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import axios from "axios";
import HomeCard from "./HomeCard";

function Upcoming({ flag }) {
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 6;
    const [activeModalId, setActiveModalId] = useState(null);

    useEffect(() => {
        fetchUpcoming();
    }, []);

    const fetchUpcoming = async () => {
        try {
            let response;
            const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
            const apiHost = process.env.REACT_APP_RAPIDAPI_HOST;
            if (flag) {
                response = await axios.get('https://imdb236.p.rapidapi.com/imdb/upcoming-releases', {
                    params: {
                        countryCode: 'IN',
                        type: 'MOVIE',
                    },
                    headers: {
                        'x-rapidapi-key': `${apiKey}`,
                        'x-rapidapi-host': `${apiHost}`,
                    },
                });
            }
            else {
                response = await axios.get('https://imdb236.p.rapidapi.com/imdb/upcoming-releases', {
                    params: {
                        countryCode: 'US',
                        type: 'TV',
                    },
                    headers: {
                        'x-rapidapi-key': `${apiKey}`,
                        'x-rapidapi-host': `${apiHost}`,
                    },
                });
            }


            const allTitles = response.data.flatMap(group => group.titles);

            // Slice if needed
            setUpcomingMovies(allTitles.slice(0, 30));
        } catch (error) {
            console.error(error);
        }
    }

    const handleNext = () => {
        if (currentIndex + itemsPerPage < upcomingMovies.length) {
            setCurrentIndex((prev) => prev + itemsPerPage);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - itemsPerPage);
        }
    };

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/upcoming", { state: { f: flag } });
    };

    return (
        <div className="flex flex-col gap-5 relative">
            <button
                onClick={handleNavigate}
                className="font-bold text-4xl hover:text-5xl text-left transition-all duration-200"
            >
                Upcoming <ArrowForwardIosIcon />
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
                    {upcomingMovies
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
                                    type: item.titleType || "movie"
                                }}
                                mediaId={item.id}
                                activeModalId={activeModalId}
                                setActiveModalId={setActiveModalId}
                            />
                        ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentIndex + itemsPerPage >= upcomingMovies.length}
                    className="text-white hover:scale-125 transition-all duration-300 p-2 disabled:opacity-30"
                >
                    <ChevronRightIcon fontSize="large" />
                </button>
            </div>
        </div>
    )
}

export default Upcoming