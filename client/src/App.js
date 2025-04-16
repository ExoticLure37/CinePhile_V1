import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import "./App.css";
import VerifyEmail from "./pages/VerifyEmail";
import Friends from "./pages/Friends";
import VerifyUpdatedEmail from "./pages/VerifyUpdatedEmail";
import FriendProfile from "./pages/FriendProfile";
import Watchlist from "./pages/Watchlist";
import FriendsWatchList from "./pages/FriendsWatchList";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Contact from "./pages/Contact";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tvshows" element={<TVShows />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friends-watchlist" element={<FriendsWatchList />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile/:friendId" element={<FriendProfile />} />
        <Route path="/dashboard" element={<Profile />} />
        <Route path="/user/verify/:token" element={<VerifyEmail />} />
        <Route
          path="/user/verify/:newEmail/:userId"
          element={<VerifyUpdatedEmail />}
        />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
