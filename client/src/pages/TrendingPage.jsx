import React, { useEffect, useState } from 'react'
import LinkNavbar from '../components/LinkNavbar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios';
import HomeCard from '../components/HomeCard';
import { useLocation } from 'react-router-dom';

function TrendingPage() {
    const [popularMovies, setPopularMovies] = useState([]);
    const [visibleCount, setVisibleCount] = useState(20)
    const [activeModalId, setActiveModalId] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    const location = useLocation();
    console.log(location)
    const flag = location.state?.f;

    useEffect(() => {
        fetchData();
    }, [flag]);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 20);
    }

    console.log(flag)

    const fetchData = async () => {
        try {
            setLoading(true); // Set loading to true when starting to fetch
            let response = null;
            const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
            const apiHost = process.env.REACT_APP_RAPIDAPI_HOST;
            if (flag) {
                response = await axios.get(
                    "https://imdb236.p.rapidapi.com/imdb/most-popular-movies",
                    {
                        headers: {
                            "x-rapidapi-key": `${apiKey}`,
                            "x-rapidapi-host": `${apiHost}`
                        }
                    }
                );
            }
            else {
                response = await axios.get('https://imdb236.p.rapidapi.com/imdb/most-popular-tv', {
                    headers: {
                        'x-rapidapi-key': `${apiKey}`,
                        'x-rapidapi-host': `${apiHost}`
                    }
                });
            }

            setPopularMovies(response.data); // Store only 30 results
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false when fetch completes
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#141414]">
            <Navbar />
            <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40">
                <LinkNavbar />
            </div>

            <div className='font-semibold text-3xl text-white p-4'>Trending</div>

            {loading ? (
                <div className="flex justify-center items-center my-10">
                    <div className="animate-spin border-t-4 border-red-500 border-solid rounded-full w-16 h-16"></div>
                </div>
            ) : popularMovies.length > 0 ? (
                <>
                    <div className='grid grid-cols-2 md:grid-cols-5 gap-x-0 gap-y-4 px-2 ml-20'>
                        {popularMovies.slice(0, visibleCount).map((item) => (
                            <HomeCard
                                key={item.id}
                                media={{
                                    ...item,
                                    primaryImage: item.primaryImage,
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

                    {visibleCount < popularMovies.length && (
                        <div className="flex justify-center my-6">
                            <button
                                onClick={handleLoadMore}
                                className="text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-white text-center mt-10">No Results Found</p>
            )}

            <div className="mt-auto">
                <Footer />
            </div>
        </div >
    )
}

export default TrendingPage;
