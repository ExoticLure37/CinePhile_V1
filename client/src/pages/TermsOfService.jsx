import React from "react";
import { motion } from "framer-motion";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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
          Terms of Service
        </h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-400">
            By using projectV's CinePhile, you agree to comply with and be bound
            by these terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            2. User Responsibilities
          </h2>
          <p className="text-gray-400">
            You agree to use the platform responsibly and not engage in any
            unlawful or harmful behavior.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            3. Modifications
          </h2>
          <p className="text-gray-400">
            We reserve the right to update these terms at any time. Continued
            use of the platform means acceptance of changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-2">4. Contact</h2>
          <p className="text-gray-400">
            If you have any questions about these terms, please contact our
            support team.
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default TermsOfService;
