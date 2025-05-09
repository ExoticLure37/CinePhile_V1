import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFriendList, setUserProfile } from "../redux/user/userSlice";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/user/login",
        { email, password, rememberMe },
        { withCredentials: true }
      );

      dispatch(
        setUserProfile({
          fullname: res.data.fullname,
          username: res.data.username,
          email: res.data.email,
          gender: res.data.gender,
          about: res.data.about,
          dob: res.data.dob,
          phone_number: res.data.phone_number,
          profilePic : res.data.profilePic
        })
      );
      toast.success("Login Successfull");
      console.log("success");
      // console.log(res.data)
      navigate("/movies");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="signIn center">
      <h6 className="absolute top-2 text-1xl md:text-1xl font-extrabold text-[#E50914] tracking-wide z-10">
        <img src="logo.png" alt="LOGO" className="h-8 w-auto md:h-14" />
      </h6>

      <div className="h-screen w-screen bg-black flex items-center justify-center text-white px-4">
        <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-lg rounded-lg overflow-hidden gap-10 md:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2 bg-black flex flex-col justify-center items-center px-10 py-10 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Catch up on your favorite movies.
            </h2>
            <p className="text-gray-300 text-md font-sans">
              Sign in to CinePhile and start enjoying! ❤️.
            </p>
          </motion.div>

          {/* Right */}
          <div className="w-full md:w-1/2 bg-black px-10 py-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">E-mail</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 rounded bg-[#2c2c2c] border border-gray-700 text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 rounded bg-[#2c2c2c] border border-gray-700 text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded-sm accent-[#E50914]"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-gray-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <button
                type="submit"
                className="mt-4 bg-[#E50914] hover:bg-[#b2070e] transition duration-200 text-white py-3 rounded font-semibold"
              >
                Sign In
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-400">New to CinePhile?</p>
              <Link to="/">
                <button className="block w-full mt-2 text-white font-semibold hover:underline">
                  Sign up now.
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
