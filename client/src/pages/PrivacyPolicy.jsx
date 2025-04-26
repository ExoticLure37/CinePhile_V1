import React from "react";
import { motion } from "framer-motion";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111] text-white px-4 py-8 md:px-24">
      <button
        onClick={() => navigate(-1)}
        className="text-white text-2xl mb-4 hover:text-red-600"
      >
        <IoArrowBackOutline />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#1a1a1a] p-8 rounded-2xl shadow-lg max-w-5xl mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-[#E50914] mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-300 mb-4">
          Your privacy is important to us. This policy explains how we handle
          and protect your personal data.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            1. Information We Collect
          </h2>
          <p className="text-gray-400">
            We collect your name, email, and usage data when you sign up,
            browse, or interact with our platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-400">
            We use your data to provide personalized experiences, improve our
            services, and communicate important updates.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            3. Data Sharing & Security
          </h2>
          <p className="text-gray-400">
            We never sell your data. We use industry-standard measures to keep
            your information safe and secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-2">
            4. Your Choices
          </h2>
          <p className="text-gray-400">
            You can update or delete your account at any time. For questions,
            feel free to contact us.
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
