import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Footer from "../components/Footer";
import { setFriendList, setPendingRequest, setRequestSent } from "../redux/user/userSlice";
import axios from "axios";
import LinkNavbar from "../components/LinkNavbar";

function Home() {
  const currentUser = useSelector((state) => state.userProfile);

  const dispatch = useDispatch();

  useEffect(() => {
    getFriends();
    getPendingRequests();
    getRequestSent();
  }, []);


  const getFriends = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/getFriends", {
        withCredentials: true
      })

      // console.log(res.data);

      dispatch(setFriendList({ friendList: res.data.friendList }))
    }
    catch (err) {
      console.log(err);
    }
  }

  const getPendingRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/pendingRequests", {
        withCredentials: true
      })

      // console.log(res);

      dispatch(setPendingRequest({ pending_requests: res.data.pending_requests }))
    }
    catch (err) {
      console.log(err);
    }
  }

  const getRequestSent = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/requestSent", {
        withCredentials: true
      })

      dispatch(setRequestSent({ request_sent: res.data.requests_sent }))
    }
    catch (err) {
      console.log(err);
    }
  }

  // console.log(currentUser);

  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      <Navbar />

      <div className="bg-slate-200 bg-opacity-20 sticky top-0 z-40">
        <LinkNavbar />
      </div>

      <div className="flex flex-col my-8 gap-10 ml-10">
        <div className="flex flex-col gap-5">
          <Link className="font-bold text-4xl hover:text-5xl transition-all duration-300">
            Watching <ArrowForwardIosIcon />
          </Link>

          <div className="flex gap-8">
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Link className="font-bold text-4xl hover:text-5xl transition-all duration-200">
            Trending <ArrowForwardIosIcon />
          </Link>

          <div className="flex gap-8">
            <div className="bg-red-600 h-60 w-56 rounded-md hover:h-64 hover:-mx-2 hover:-my-2 hover:w-60 transition-all duration-100"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Link className="font-bold text-4xl hover:text-5xl transition-all duration-300">
            Upcoming <ArrowForwardIosIcon />
          </Link>

          <div className="flex gap-8">
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Link className="font-bold text-4xl hover:text-5xl transition-all duration-300">
            Latest <ArrowForwardIosIcon />
          </Link>

          <div className="flex gap-8">
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
            <div className="bg-red-600 h-60 w-1/6 rounded-md"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
