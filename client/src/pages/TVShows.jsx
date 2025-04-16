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
import HomeCard from "../components/HomeCard";
import Trending from "../components/Trending";
import Upcoming from "../components/Upcoming";
import TopMoviesShows from "../components/TopMoviesShows";

function TVShows() {
    const currentUser = useSelector((state) => state.userProfile);
    const dispatch = useDispatch();

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
                <Trending flag={false} />

                {/* Upcoming Section */}
                <Upcoming flag={false} />

                {/* Latest Section */}
                <TopMoviesShows flag={false} />
            </div>

            <Footer />
        </div>
    );
}

export default TVShows;
