import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Footer from "../components/Footer";
import axios from "axios";
import {
  setFriendList,
  setPendingRequest,
  setRequestSent
} from "../redux/user/userSlice";
import LinkNavbar from "../components/LinkNavbar";
import MediaCard from "../components/MediaCard";
import HomeCard from "../components/HomeCard";

function Movies() {
  const currentUser = useSelector((state) => state.userProfile);
  const dispatch = useDispatch();

  const [activeModalId, setActiveModalId] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;

  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    getFriends();
    getPendingRequests();
    getRequestSent();
    fetchData();
    // fetchComingSoon();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://imdb236.p.rapidapi.com/imdb/most-popular-movies",
        {
          headers: {
            "x-rapidapi-key": "ac756fd330msh8c169a5cfb93ae0p1fee36jsn17b73def8bef",
            "x-rapidapi-host": "imdb236.p.rapidapi.com"
          }
        }
      );

      setPopularMovies(response.data.slice(0, 30)); // Store only 20 results
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchComingSoon = async () => {
  //   try {
  //     const options = {
  //       method: 'GET',
  //       url: 'https://imdb232.p.rapidapi.com/api/title/get-coming-soon',
  //       params: {
  //         limit: '20',
  //         comingSoonType: 'MOVIE'
  //       },
  //       headers: {
  //         'x-rapidapi-key': '0a976bef91msha866008250a5b1ep109f88jsnb240c667e126',
  //         'x-rapidapi-host': 'imdb232.p.rapidapi.com'
  //       }
  //     };

  //     const response = await axios.request(options);

  //     const edges = response.data?.data?.comingSoon?.edges?.slice(0, 30) || [];
  //     const imdbIds = edges.map(edge => edge.node.id);

  //     const detailedPromises = imdbIds.map(id => fetchMovieDetails(id));
  //     const detailedMovies = await Promise.all(detailedPromises);

  //     setUpcoming(detailedMovies);
  //     console.log(response.data.data.comingSoon);
  //     console.log(imdbIds)
  //     console.log(detailedMovies);
  //   } catch (err) {
  //     console.error(err);
  //     // setError(err);
  //   }
  // };

  const fetchMovieDetails = async (id) => {
    try {
      const options = {
        method: 'GET',
        url: `https://imdb236.p.rapidapi.com/imdb/${id}`,
        headers: {
          'x-rapidapi-key': '0a976bef91msha866008250a5b1ep109f88jsnb240c667e126',
          'x-rapidapi-host': 'imdb236.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      // setMovie(response.data);
    } catch (err) {
      console.error(err);
      // setError(err);
    }
  };

  const getFriends = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/getFriends", {
        withCredentials: true
      });
      dispatch(setFriendList({ friendList: res.data.friendList }));
    } catch (err) {
      console.log(err);
    }
  };

  const getPendingRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/pendingRequests", {
        withCredentials: true
      });
      dispatch(setPendingRequest({ pending_requests: res.data.pending_requests }));
    } catch (err) {
      console.log(err);
    }
  };

  const getRequestSent = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/requestSent", {
        withCredentials: true
      });
      dispatch(setRequestSent({ request_sent: res.data.requests_sent }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleNext = () => {
    if (currentIndex + itemsPerPage < popularMovies.length) {
      setCurrentIndex((prev) => prev + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - itemsPerPage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      <Navbar />
      <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40">
        <LinkNavbar />
      </div>

      <div className="flex flex-col my-8 gap-10 ml-10">
        {/* Watching Section */}
        <div className="flex flex-col gap-5">
          <Link className="font-bold text-4xl hover:text-5xl transition-all duration-300">
            Watching <ArrowForwardIosIcon />
          </Link>
          <div className="flex gap-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-red-600 h-60 w-1/6 rounded-md"
              ></div>
            ))}
          </div>
        </div>

        {/* Trending Section - Netflix-style Scroll */}
        <div className="flex flex-col gap-5 relative">
          <Link className="font-bold text-4xl hover:text-5xl transition-all duration-200">
            Trending <ArrowForwardIosIcon />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="text-white hover:scale-125 transition-all duration-300 p-2 disabled:opacity-30"
            >
              <ChevronLeftIcon fontSize="large" />
            </button>

            <div className="flex gap-8 transition-all duration-300">
              {popularMovies
                .slice(currentIndex, currentIndex + itemsPerPage)
                .map((item) => (
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

            <button
              onClick={handleNext}
              disabled={currentIndex + itemsPerPage >= popularMovies.length}
              className="text-white hover:scale-125 transition-all duration-300 p-2 disabled:opacity-30"
            >
              <ChevronRightIcon fontSize="large" />
            </button>
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="flex flex-col gap-5">
          <Link className="font-bold text-4xl hover:text-5xl transition-all duration-300">
            Upcoming <ArrowForwardIosIcon />
          </Link>
          <div className="flex gap-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-red-600 h-60 w-1/6 rounded-md"
              ></div>
            ))}
          </div>
        </div>

        {/* Latest Section */}
        <div className="flex flex-col gap-5">
          <Link className="font-bold text-4xl hover:text-5xl transition-all duration-300">
            Latest <ArrowForwardIosIcon />
          </Link>
          <div className="flex gap-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-red-600 h-60 w-1/6 rounded-md"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Movies;
