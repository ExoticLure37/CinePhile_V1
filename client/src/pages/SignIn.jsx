import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
//import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/user/login",
        { email, password, rememberMe },
        { withCredentials: true }
      );

      navigate("/home"); // Redirect after successful login
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed!");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center bg-[#141414] text-white px-4 w-full">
      {/* Netflix-style Header */}
      <div className="w-full mt-5 flex justify-between items-center py-4 px-6 bg-[#E50914] rounded-lg">
        <h1 className="text-2xl font-bold">projectV</h1>
        <span className="text-white text-lg">Sign In</span>
      </div>

      {/* Netflix-style Sign-in Form */}
      <div className="w-full max-w-md bg-[#1F1F1F] p-8 rounded-lg shadow-lg mt-20">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold">E-mail</label>
            <input
              className="w-full rounded-md p-3 bg-[#333] text-white border border-gray-600 focus:outline-none focus:border-white"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-semibold">Password</label>
            <input
              className="w-full rounded-md p-3 bg-[#333] text-white border border-gray-600 focus:outline-none focus:border-white"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded-sm accent-[#E50914]"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span>Remember Me</span>
            </div>
            <Link to="/" className="text-gray-400 hover:underline">
              Forget password
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#E50914] text-white py-3 rounded-md font-semibold hover:bg-[#b2070e] transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-400">New to projectV?</span>
          <Link to="/">
            <button className="block w-full mt-2 text-white font-semibold hover:underline">
              Sign up now.
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
