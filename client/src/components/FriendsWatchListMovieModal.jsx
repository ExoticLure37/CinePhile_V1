import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "./Card";

const FriendsWatchListMovieModal = ({
  watchlistId,
  closeModal,
  watchlistName,
  friendId,
}) => {
  const [movies, setMovies] = useState([]);

  const getAllWatchListMovie = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/watchlist/friends-watchlist-movie/${friendId}/${watchlistId}`,
        { withCredentials: true }
      );
      //console.log(typeof res.data.watchlists.watchlists)
      // console.log("hello")
      setMovies(res.data.items);
      //console.log(res.data.items);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  /*const getWatchlistDetail = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/watchlist/${id}`, { withCredentials: true });
            setCurrentWatchlist(res.data.items);
        } catch (err) {
            console.log(err);
        }
    }*/

  useEffect(() => {
    getAllWatchListMovie();
    // watchlists.forEach(element => {
    //     console.log(element.title)
    // });
    //console.log("WATCHLIST");
    //console.log(watchlists);
    //console.log(friendId)
    console.log(movies)
  }, []);

  useEffect(() => {
    console.log("Updated movies:", movies);
    // if (movies) {
    //   console.log(movies);
    // }
  }, [movies]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-40`}
      >
        <div className="bg-[#1a1a1a] rounded-2xl max-w-[170vh] w-full shadow-2xl relative max-h-[90vh] overflow-y-auto overflow-auto scrollbar-hide">
          <button
            className="absolute top-3 right-4 text-white font-bold text-xl z-10 hover:text-red-600 transition"
            onClick={closeModal}
          >
            ✕
          </button>
          <div className="flex flex-col items-center justify-center px-4 py-10">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-200">
              {watchlistName}
            </h1>
            <div className="w-full max-w-[150vh] gap-14 flex flex-row flex-wrap  bg-[#1F1F1F] p-6 rounded-xl shadow-xl border border-gray-700">
                {movies && movies.length > 0 ? (
                  movies.map((movie, index) => (
                    <>
                      <Card key={movie.imdb_id} imageUrl={movie.imageUrl} name={movie.name} url={movie.url} trailer={movie.trailer} />
                      {/*<li
                        key={movie.imdb_id}
                        className="flex items-center p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#3A3A3A] transition-all shadow-sm border border-gray-600"
                      >
                        {/*<span className="text-lg font-semibold text-gray-300">
                          {index + 1}.
                        </span>*/}
                       {/*} <img src={movie.imageUrl} alt="" />
                        <p className="ml-3 text-lg font-medium text-gray-100 hover:text-blue-400 transition-all">
                          {movie.name}
                        </p>
                        {/*<div
                          onClick={() =>
                            openMovieModal(watchlist._id, watchlist.title)
                          }
                          className="ml-auto"
                        >
                          <IconBtn text="View" />
                        </div>*/}
                      {/*</></li>*/}
                    </>
                  ))
                ) : (
                  <p className="text-center text-gray-400">
                    No Movies found.
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendsWatchListMovieModal;
