import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import Footer from "../components/Footer";
import { motion } from "framer-motion";

function SignUp() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const backendUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/user/register`;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (
      !formData.fullname ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required!");
      return;
    }

    try {
      console.log(formData);
      const response = await axios.post(backendUrl, formData);
      console.log(response.data);
      setFormData({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      console.log("Verification mail is sent successfully");
    } catch (error) {
      console.error(error);
    }

    //const response=axios.post(backendUrl)
  };

  return (
    <div className="signUp center">
      <h6 className="absolute top-2 text-1xl md:text-1xl font-extrabold text-[#E50914] tracking-wide z-10">
        <img src="logo.png" alt="LOGO" className="h-8 w-auto md:h-14" />
      </h6>

      <div className="h-screen w-screen bg-black flex items-center justify-center text-white px-4">
        <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-lg rounded-lg overflow-hidden gap-10 md:gap-20">
          {/* Left  */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2 bg-black flex flex-col justify-center items-center px-10 py-10 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your movies. Your friends. One place
            </h2>
            <p className="text-gray-300 text-md font-sans">
              With ProjectV, discover trending titles, build watchlists, and
              connect over what you ❤️.
            </p>
          </motion.div>

          {/* Right  */}
          <div className="w-full md:w-1/2 bg-black px-10 py-10">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create your account
            </h2>

            <form onSubmit={submitHandler} className="flex flex-col gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-semibold mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={key.includes("password") ? "password" : "text"}
                    name={key}
                    placeholder={
                      key !== "confirmPassword" ? `${key}` : "re enter password"
                    }
                    value={value}
                    onChange={handleChange}
                    className="p-2 rounded bg-[#2c2c2c] border border-gray-700 text-white focus:outline-none focus:border-white"
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                className="mt-4 bg-[#E50914] hover:bg-[#b2070e] transition duration-200 text-white py-3 rounded font-semibold"
              >
                Create Account
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-gray-400">Already have an account?</p>
              <Link to="/signin">
                <span className="text-white font-semibold hover:underline">
                  Sign in now.
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
