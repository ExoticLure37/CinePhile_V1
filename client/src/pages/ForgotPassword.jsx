import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/user/forgot-password`,
        { email },
        { withCredentials: true },
      );
      toast.success("Password reset link sent to your email!", {
        theme: "dark",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link", {
        theme: "dark",
      });
    }
  };

  return (
    <div className="forgotPassword center">
      {/* Logo on top */}
      <h6 className="absolute top-2 text-1xl md:text-1xl font-extrabold text-[#E50914] tracking-wide z-10">
        <img src="logo.png" alt="LOGO" className="h-12 w-auto md:h-14" />
      </h6>

      <div className="h-screen w-screen bg-black flex items-center justify-center text-white px-4">
        <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-lg rounded-lg overflow-hidden gap-10 md:gap-20">
          {/* Left side message */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2 bg-black flex flex-col justify-center items-center px-10 py-10 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trouble signing in?
            </h2>
            <p className="text-gray-300 text-md font-sans">
              Enter your email and we’ll send you a password reset link.
            </p>
          </motion.div>

          {/* Right side form */}
          <div className="w-full md:w-1/2 bg-black px-10 py-10">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Forgot Password
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">E-mail</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 rounded bg-[#2c2c2c] border border-gray-700 text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 bg-[#E50914] hover:bg-[#b2070e] transition duration-200 text-white py-3 rounded font-semibold"
              >
                Send Reset Link
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-400">Remember your password?</p>
              <a href="/signin">
                <button className="block w-full mt-2 text-white font-semibold hover:underline">
                  Sign in instead.
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
