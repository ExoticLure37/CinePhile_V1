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
    <footer className="bg-[#191919] text-white py-4 px-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-4">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="icon text-2xl hover:text-gray-300 transition duration-300" />
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin className="icon text-2xl hover:text-gray-300 transition duration-300" />
        </a>
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className="icon text-2xl hover:text-gray-300 transition duration-300" />
        </a>
      </div>

      <div className="text-sm flex items-center space-x-2 mt-3 md:mt-0">
      <FaCopyright />
        <span> 2025 projectV</span>
        <FaTrademark />
      </div>
    </footer>
  );
};

export default Footer;
