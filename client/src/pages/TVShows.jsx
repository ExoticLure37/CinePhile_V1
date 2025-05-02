import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MediaCarousel from "../components/MediaCarousel";
import Footer from "../components/Footer";
import axios from "axios";
import {
    setFriendList,
    setPendingRequest,
    setRequestSent
} from "../redux/user/userSlice";
import LinkNavbar from "../components/LinkNavbar";
import HomeCard from "../components/HomeCard";


function TVShows() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.userProfile);
    const trendingEndPoint = "https://imdb236.p.rapidapi.com/imdb/most-popular-tv";
    const upcomingEndPoint = "https://imdb236.p.rapidapi.com/imdb/upcoming-releases";
    const topmoviesEndPoint = "https://imdb236.p.rapidapi.com/imdb/top250-tv";

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [friendsRes, pendingRes, sentRes] = await Promise.all([
                    axios.get("http://localhost:5000/user/getFriends", { withCredentials: true }),
                    axios.get("http://localhost:5000/user/pendingRequests", { withCredentials: true }),
                    axios.get("http://localhost:5000/user/requestSent", { withCredentials: true })
                ]);

                dispatch(setFriendList({ friendList: friendsRes.data.friendList }));
                dispatch(setPendingRequest({ pending_requests: pendingRes.data.pending_requests }));
                dispatch(setRequestSent({ request_sent: sentRes.data.requests_sent }));
            } catch (err) {
                console.error(err);
            }
        };

        fetchAll();
    }, []);

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

    return (
        <div className="min-h-screen flex flex-col bg-[#141414]">
            <Navbar />
            <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40">
                <LinkNavbar />
            </div>

            <div className="flex flex-col my-8 gap-10 ml-10">
                {/* Trending Section - Netflix-style Scroll */}
                <MediaCarousel
                    title="Trending Shows"
                    endpoint={trendingEndPoint}
                    navigateTo="/trending"
                    flag={false}
                    normalizeData={(data) => data}
                />

                {/* Upcoming Section */}
                <MediaCarousel
                    title="Upcoming"
                    endpoint={upcomingEndPoint}
                    navigateTo="/upcoming"
                    flag={false}
                    normalizeData={(data) => data}
                />


                {/* Latest Section */}
                <MediaCarousel
                    title="Top Tv Shows"
                    endpoint={topmoviesEndPoint}
                    navigateTo="/top-movies-shows"
                    flag={false}
                    normalizeData={(data) => data}
                />
            </div>

            <Footer />
        </div>
    );
}

export default TVShows;
