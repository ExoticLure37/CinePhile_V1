import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";

const Contact = () => {
  const user = useSelector((state) => state.userProfile);
  const [formData, setFormData] = useState({
    name: user.username || "",
    email: user.email || "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;
    const backendUrl = "http://localhost:5000/user/contact";

    if (!name || !email || !message) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl,
        { name, email, message },
        { withCredentials: true }
      );

      toast.success(response.data.message || "Message sent successfully!");
      setFormData({ name: name, email: email, message: "" });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="relative flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 bg-center bg-cover opacity-30 blur-sm bg-[url('/images/contactbg.jpg')]" />

        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center bg-[#171717] bg-opacity-60 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-lg">
          <h1 className="text-3xl font-bold text-[#f9dc4b] mb-6">Contact Us</h1>
          <p className="text-gray-300 text-center mb-8">
            Got a question? We'd love to hear from you. Fill out the form below
            and we'll respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {["name", "email", "message"].map((field) => (
              <div key={field}>
                <label className="block text-gray-300 mb-2 capitalize">
                  {field}
                </label>
                {field !== "message" ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter your ${field}`}
                    className="w-full px-4 py-2 bg-[#333] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]"
                    required
                  />
                ) : (
                  <textarea
                    name={field}
                    rows="4"
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-2 bg-[#333] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]"
                    required
                  ></textarea>
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#E50914] to-[#b2070e] text-white px-6 py-2 rounded-lg font-semibold hover:from-[#b2070e] hover:to-[#E50914] transition-all duration-200 shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
