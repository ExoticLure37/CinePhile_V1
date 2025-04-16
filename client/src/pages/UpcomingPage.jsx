import React, { useEffect, useState } from 'react'
import LinkNavbar from '../components/LinkNavbar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios';
import HomeCard from '../components/HomeCard';
import { useLocation } from 'react-router-dom';

function UpcomingPage() {
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [visibleCount, setVisibleCount] = useState(20)
    const [activeModalId, setActiveModalId] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    const location = useLocation();
    const flag = location.state?.f;

    useEffect(() => {
        fetchUpcoming();
    }, [flag]);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 20);
    }

    const fetchUpcoming = async () => {
        try {
            setLoading(true);
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
            setUpcomingMovies(allTitles);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false when fetch completes
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#141414]">
            <Navbar />
            <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40">
                <LinkNavbar />
            </div>

            <div className='font-semibold text-3xl text-white p-4'>Upcoming</div>

            {loading ? (
                <div className="flex justify-center items-center my-10">
                    <div className="animate-spin border-t-4 border-red-500 border-solid rounded-full w-16 h-16"></div>
                </div>
            ) : upcomingMovies.length > 0 ? (
                <>
                    <div className='grid grid-cols-2 md:grid-cols-5 gap-x-0 gap-y-4 px-2 ml-20'>
                        {upcomingMovies.slice(0, visibleCount).map((item) => (
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

                    {visibleCount < upcomingMovies.length && (
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

export default UpcomingPage;
