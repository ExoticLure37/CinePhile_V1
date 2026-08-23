import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/user/reset-password/${token}`,
        { password },
        { withCredentials: true },
      );
      toast.success("Password reset successfully!", { theme: "dark" });
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="resetPassword center">
      <h6 className="absolute top-2 text-1xl md:text-1xl font-extrabold text-[#E50914] tracking-wide z-10">
        <img src="/logo.png" alt="LOGO" className="h-12 w-auto md:h-14" />
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
              Don't worry, we've got you!
            </h2>
            <p className="text-gray-300 text-md font-sans">
              Set a new password and get back to watching 🎬.
            </p>
          </motion.div>

          <div className="w-full md:w-1/2 bg-black px-10 py-10">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Reset Password
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 rounded bg-[#2c2c2c] border border-gray-700 text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="p-3 rounded bg-[#2c2c2c] border border-gray-700 text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <button
                type="submit"
                className="mt-4 bg-[#E50914] hover:bg-[#b2070e] transition duration-200 text-white py-3 rounded font-semibold"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
