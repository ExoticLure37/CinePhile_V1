import axios from "axios";
import React, { useEffect, useState } from "react";
import IconBtn from "./IconBtn";
import FriendsWatchListMovieModal from "./FriendsWatchListMovieModal";

const FriendsWatchListModal = ({ friendId, closeModal, friendName }) => {
  const [watchlists, setWatchLists] = useState([]);
  const [openMovie, setOpenMovie] = useState(false);
  const [watchlistId,setwatchlistId]= useState('');
  const [watchlistName,setwatchlistName]= useState('')


  const getAllWatchList = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/watchlist/friends-watchlist/${friendId}`,
        { withCredentials: true }
      );
      //console.log(typeof res.data.watchlists.watchlists)
      // console.log("hello")
      setWatchLists(res.data.watchlists);
      //console.log(res.data)
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const closeMovieModal = async()=>{
    setOpenMovie(false)
    setwatchlistId('')
    setwatchlistName('')
  }

  const openMovieModal= async(watchlistIdd,watchlistNamee)=>{
    setOpenMovie(true)
    setwatchlistId(watchlistIdd)
    setwatchlistName(watchlistNamee)
  }

  /*const getWatchlistDetail = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/watchlist/${id}`, { withCredentials: true });
            setCurrentWatchlist(res.data.items);
        } catch (err) {
            console.log(err);
        }
    }*/

  useEffect(() => {
    getAllWatchList();
    // watchlists.forEach(element => {
    //     console.log(element.title)
    // });
    console.log("WATCHLIST");
    console.log(watchlists);
    //console.log(friendId)
  }, []);

  useEffect(() => {
    //console.log("Updated watchlists:", watchlists);
    if (watchlists) {
      console.log(watchlists);
    }
  }, [watchlists]);

  return (
    <>
      {/*<button
        onClick={closeModal}
        className="bg-white h-[100px] w-[100px] text-black"
      >
        CLOSE
      </button>*/}
      <div className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center ${openMovie?"-z-10":"z-30"}`}>
        <div className="bg-[#1a1a1a] rounded-2xl max-w-[110vh] w-full shadow-2xl relative max-h-[90vh] overflow-y-auto overflow-auto scrollbar-hide">
          <button
            className="absolute top-3 right-4 text-white font-bold text-xl z-10 hover:text-red-600 transition"
            onClick={closeModal}
          >
            ✕
          </button>
          <div className="flex flex-col items-center justify-center px-4 py-10">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-200">
              {friendName}'s Watchlists
            </h1>
            <div className="w-full max-w-2xl bg-[#1F1F1F] p-6 rounded-xl shadow-xl border border-gray-700">
              <ul className="space-y-4">
                {watchlists && Object.keys(watchlists).length > 0 ? (
                  watchlists.map((watchlist, index) => (
                    <>
                      <li
                        key={watchlist._id}
                        className="flex items-center p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#3A3A3A] transition-all shadow-sm border border-gray-600"
                      >
                        <span className="text-lg font-semibold text-gray-300">
                          {index + 1}.
                        </span>
                        <p className="ml-3 text-lg font-medium text-gray-100 hover:text-blue-400 transition-all">
                          {watchlist.title}
                        </p>
                        <div
                          onClick={() => openMovieModal(watchlist._id,watchlist.title)}
                          className="ml-auto"
                        >
                          <IconBtn text="View" />
                        </div>
                      </li>
                    </>
                  ))
                ) : (
                  <p className="text-center text-gray-400">
                    No watchlists found.
                  </p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {openMovie && 
        <FriendsWatchListMovieModal
            watchlistId={watchlistId}
            closeModal={closeMovieModal}
            watchlistName={watchlistName}
            friendId={friendId}/>
        }


      {/*<div>
        {watchlists ? (
          watchlists.map((watchlist, index) => <div>{watchlist.title}</div>)
        ) : (
          <p className="text-center text-gray-400">No watchlists found.</p>
        )}
      </div>*/}
    </>
  );
};

export default FriendsWatchListModal;
