import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function SignUp() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const backendUrl = "http://localhost:5000/user/register";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.fullname || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    try {
      console.log(formData)
      const response = await axios.post(backendUrl,formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    //const response=axios.post(backendUrl)
  };

  return (
    <div className="h-screen overflow-x-hidden overflow-hidden overflow-y-hidden flex flex-col justify-center items-center bg-[#141414] text-white px-4">
      {/* Netflix-style Header */}
      <div className="w-full flex justify-between items-center py-4 px-6 bg-[#E50914] rounded-lg">
        <h1 className="text-2xl font-bold">projectV</h1>
        <span className="text-white font-large">Sign Up</span>
      </div>

      {/* Netflix-style Sign-in Form */}
      <div className="w-full max-w-sm bg-[#1F1F1F] p-6 rounded-lg shadow-lg mt-6">
        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={submitHandler} className="flex flex-col gap-3">
          {Object.entries(formData).map(([key, value]) => (
            <div className="flex flex-col" key={key}>
              <label className="mb-1 text-sm font-semibold">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                className="rounded-md p-2 bg-[#333] text-white border border-gray-600 focus:outline-none focus:border-white"
                type={key.includes("password") ? "password" : "text"}
                name={key}
                placeholder={`Enter your ${key}`}
                value={value}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-[#E50914] text-white py-2 rounded-md font-semibold hover:bg-[#b2070e] transition-all duration-200"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-400">Already have an account?</span>
          <Link to="/signin">
            <button className="block w-full mt-2 text-white font-semibold hover:underline">Sign in now.</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
