import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import "./App.css";
import VerifyEmail from "./pages/VerifyEmail";
import Friends from "./pages/Friends";
import VerifyUpdatedEmail from "./pages/VerifyUpdatedEmail";
import FriendProfile from "./pages/FriendProfile";
import Watchlist from "./pages/Watchlist";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile/:friendId" element={<FriendProfile />} />
        <Route path="/dashboard" element={<Profile />} />
        <Route path="/user/verify/:token" element={<VerifyEmail />} />
        <Route path="/user/verify/:newEmail/:userId" element={<VerifyUpdatedEmail />} />
      </Routes>
    </div>
  );
}

export default App;
