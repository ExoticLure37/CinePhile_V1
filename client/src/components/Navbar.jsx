import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MediaCard from "./MediaCard";

const Navbar = () => {
  const currentUser = useSelector((state) => state.userProfile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [visibleResults, setVisibleResults] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModalId, setActiveModalId] = useState(null);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const fetchMovieByTitle = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://imdb236.p.rapidapi.com/imdb/search",
        {
          params: {
            originalTitle: `${searchQuery}`,
            rows: 40,
            sortOrder: "ASC",
            sortField: "id",
          },
          headers: {
            "x-rapidapi-key": "ac756fd330msh8c169a5cfb93ae0p1fee36jsn17b73def8bef",
            "x-rapidapi-host": "imdb236.p.rapidapi.com",
          },
        }
      );
      setSearchResults(response.data.results);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Top Navbar */}
      <div className="navbar w-full flex justify-between items-center py-3 px-6 text-white bg-gradient-to-r from-[#e50914] to-[#b00610] shadow-md">
        <div className="flex-1">
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide hover:text-gray-200 transition-all"
          >
            project<span className="text-yellow-400">V</span>
          </Link>
        </div>
        <div className="flex-none flex items-center gap-4">
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 shadow-inner border border-gray-700 focus-within:ring-2 focus-within:ring-yellow-400">
            <input
              type="text"
              className="outline-none text-white placeholder-gray-400 bg-transparent w-44 transition-all"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => {
                setIsSearchOpen(true);
                fetchMovieByTitle();
              }}
              className="ml-2 text-yellow-400 hover:scale-110 transition-transform"
            >
              🔍
            </button>
          </div>

          {/* User Avatar & Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex="0"
              role="button"
              className="btn btn-ghost btn-circle avatar hover:ring-2 ring-yellow-400 transition-all"
            >
              <div className="w-10 rounded-full ring ring-offset-2 ring-yellow-400 ring-offset-black">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul className="menu menu-sm dropdown-content mt-3 z-[60] p-2 shadow-xl bg-black rounded-xl w-52 border border-gray-700 text-white">
              <li>
                {currentUser.username !== "" ? (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-yellow-400 text-left w-full"
                  >
                    {currentUser.username}
                  </button>
                ) : (
                  <Link to="/signin" className="hover:text-yellow-400">
                    Login
                  </Link>
                )}
              </li>
              <li>
                <a className="hover:text-yellow-400">My List</a>
              </li>
              <li>
                <a className="hover:text-yellow-400">Contact</a>
              </li>
              <li>
                <a className="hover:text-yellow-400">Settings</a>
              </li>
              {currentUser.username !== "" && (
                <li>
                  <a onClick={logoutHandler} className="hover:text-yellow-400">
                    Logout
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md transition-all duration-300">
          <div className="animate-fade-in-up bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl w-11/12 max-w-6xl border border-gray-700 flex flex-col items-center">
            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-6 tracking-wide">
              🔎 Search Movies & Shows
            </h2>

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
                onClick={() => {
                  fetchMovieByTitle();
                  setVisibleResults(10);
                }}
                className="text-white text-xl hover:scale-110 transition-transform"
              >
                🔍
              </button>
            </div>

            {/* Loader */}
            {isLoading && (
              <div className="mt-6 max-h-[25rem] flex items-center gap-4 justify-center overflow-y-auto bg-gray-800 p-5 rounded-xl shadow-inner w-full border border-gray-700 transition-all">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white text-base font-medium">
                  Loading...
                </span>
              </div>
            )}

            {/* Search Results */}
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

                {/* Load More */}
                {visibleResults < searchResults.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                      onClick={() =>
                        setVisibleResults((prev) => prev + 10)
                      }
                    >
                      Load More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7 7 7-7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              !isLoading && (
                <div className="mt-6 flex h-[30vh] justify-center items-center bg-gray-800 p-5 rounded-xl shadow-inner w-full border border-gray-700 transition-all">
                  <span className="text-white mx-auto text-3xl font-semibold">
                    No Search Results
                  </span>
                </div>
              )
            )}

            {/* Close Button */}
            <button
              className="mt-8 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:scale-105 hover:from-red-500 transition-all shadow-lg"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
                setVisibleResults(10);
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
