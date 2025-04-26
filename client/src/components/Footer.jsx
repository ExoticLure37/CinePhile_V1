import React from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaCopyright,
  FaTrademark,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] text-gray-300 py-12 px-6 md:px-16 relative overflow-hidden">
      {/* Decorative Background Blur */}
      {/* <div className="absolute -top-10 -left-10 w-72 h-72 bg-red-600 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-red-600 rounded-full opacity-20 blur-3xl"></div> */}

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        {/* Left Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-white text-2xl font-bold">projectV</h2>
          <p className="max-w-xs text-sm text-gray-400">
            Your ultimate destination for movies, shows, and entertainment
            magic. Stay tuned, stay inspired.
          </p>
          {/* Socials */}
          <div className="flex gap-5 mt-4">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transform hover:scale-110 transition-all duration-300"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transform hover:scale-110 transition-all duration-300"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transform hover:scale-110 transition-all duration-300"
            >
              <FaWhatsapp size={24} />
            </a>
          </div>
        </div>

        {/* Center Links */}
        <div className="flex flex-col gap-6 text-sm text-gray-400">
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-semibold mb-1">Quick Links</h3>
            <a href="/about-us" className="hover:text-white transition-all">
              About Us
            </a>
            <a href="/contact" className="hover:text-white transition-all">
              Contact
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-white font-semibold mb-1">Legal</h3>
            <a
              href="/privacy-policy"
              className="hover:text-white transition-all"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="hover:text-white transition-all"
            >
              Terms of Service
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="w-full md:w-1/3 bg-[#1a1a1a] rounded-xl p-6 shadow-lg backdrop-blur-md flex flex-col gap-4">
          <h3 className="text-white text-lg font-semibold">Stay Updated 🚀</h3>
          <p className="text-gray-400 text-sm">
            Subscribe to get exclusive content and offers.
          </p>
          {/* <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent border border-gray-600 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-r-lg font-semibold transition-all"
            >
              Subscribe
            </button>
          </form> */}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 text-center mt-12 text-xs text-gray-500">
        <div className="flex justify-center items-center gap-2">
          <FaCopyright />
          <span>2025 projectV</span>
          <FaTrademark />
        </div>
        <p className="mt-2">Made with ❤️ for movie lovers.</p>
      </div>
    </footer>
  );
};

export default Footer;
