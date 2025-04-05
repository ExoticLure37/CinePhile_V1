import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import MediaCard from "./MediaCard";


const Navbar = () => {
  const currentUser = useSelector((state) => state.userProfile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [visibleResults, setVisibleResults] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const fetchMovieByTitle = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://imdb236.p.rapidapi.com/imdb/search',
        {
          params: {
            originalTitle: `${searchQuery}`,
            rows: 40,
            sortOrder: 'ASC',
            sortField: 'id'
          },
          headers: {
            'x-rapidapi-key': '0a976bef91msha866008250a5b1ep109f88jsnb240c667e126', // Replace with your actual API key
            'x-rapidapi-host': 'imdb236.p.rapidapi.com'
          }
        }
      );
      setIsLoading(false);
      setSearchResults(response.data.results);
      // console.log(response.data.results);
      // console.log(searchResults);
    } catch (err) {
      // setError(err);
      setIsLoading(false);
      console.log(err)
    }
  };

  return (
    <div>
      <div className="navbar w-full flex justify-between items-center py-2 px-6 text-white bg-[#E50914]">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">projectV</a>
        </div>
        <div className="flex-none flex items-center gap-4">
          <div className="flex items-center borde bg-gray-800 rounded-lg px-2 py-1">
            <input
              type="text"
              className="outline-none px-2 text-white w-40 bg-gray-800"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => {
              setIsSearchOpen(true);
              fetchMovieByTitle()
            }} className="px-2 text-black">🔍</button>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex="0" role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul tabIndex="0" className="menu menu-sm dropdown-content bg-black rounded-box z-50 mt-3 w-52 p-2 shadow">
              <li>
                {currentUser.username !== "" ? (
                  <a onClick={() => navigate("/dashboard")}>{currentUser.username}</a>
                ) : (
                  <Link to={'/signin'}>Login</Link>
                )}
              </li>
              <li><a>My List</a></li>
              <li><a>Contact</a></li>
              <li><a>Settings</a></li>
              {currentUser.username !== "" && <li><a onClick={logoutHandler}>Logout</a></li>}
            </ul>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 transition duration-300">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl w-11/12 max-w-6xl flex flex-col items-center border border-gray-700">

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-6 tracking-wide">🔎 Search Movies & Shows</h2>

            {/* Search Input */}
            <div className="flex items-center bg-gray-700 rounded-lg px-4 py-3 w-full max-w-2xl border border-gray-600 shadow-inner focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                className="outline-none bg-transparent text-white placeholder-gray-400 w-full pr-2"
                placeholder="Search by title, genre, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={fetchMovieByTitle}
                className="text-white text-xl hover:scale-110 transition-transform"
              >
                🔍
              </button>
            </div>

            {/* Loading Spinner (inside modal, below input) */}
            {isLoading && (
              <div className="mt-6 max-h-[25rem] flex items-center gap-4 justify-center overflow-y-auto bg-gray-800 p-5 rounded-xl shadow-inner w-full border border-gray-700 transition-all">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white text-base font-medium">Loading...</span>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && searchResults?.length > 0 ? (
              <div className="mt-6 max-h-[25rem] overflow-y-auto bg-gray-800 p-5 rounded-xl shadow-inner w-full border border-gray-700 transition-all">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                  {searchResults.slice(0, visibleResults).map((item) => (
                    <MediaCard
                      key={item.id}
                      media={{
                        ...item,
                        primaryImage: item.primaryImage,
                        primaryTitle: item.originalTitle || "No Title",
                        genres: item.genres || [],
                        spokenLanguages: item.spokenLanguages || ['en'],
                        countriesOfOrigin: item.countriesOfOrigin || [],
                        url: `https://www.imdb.com/title/${item.id}`,
                        type: item.titleType || "movie",
                      }}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleResults < searchResults.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                      onClick={() => setVisibleResults((prev) => prev + 8)}
                    >
                      Load More
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7 7 7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : !isLoading && (
              <div className="mt-6 flex h-[30vh] justify-center items-center bg-gray-800 p-5 rounded-xl shadow-inner w-full border border-gray-700 transition-all">
                <span className="text-white mx-auto text-3xl font-semibold">No Search Results</span>
              </div>
            )}

            {/* Close Button */}
            <button
              className="mt-8 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 shadow-lg"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default Navbar;
