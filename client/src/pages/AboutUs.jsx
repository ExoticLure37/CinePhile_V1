import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-8 md:px-16 py-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-400 hover:text-white p-2 transition"
      >
        <IoArrowBack size={28} />
      </button>
    
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-[#111] px-8 py-10 rounded-2xl border border-gray-800 shadow-2xl"
      >
        <h1 className="text-4xl font-extrabold text-[#E50914] mb-6">
          About projectV's <span className="text-white">CinePhile</span>
        </h1>

        <p className="text-gray-300 text-lg mb-10 leading-relaxed">
          Welcome to <span className="text-white font-semibold">projectV</span>{" "}
          — your destination to discover, manage, and share your love for movies
          and shows. Whether you're a cinephile or a casual viewer, we bring
          people together to explore new favorites and share watchlists with
          friends.
        </p>

        <div className="space-y-8">
          {[
            {
              title: "🎯 Our Mission",
              content:
                "We aim to build a seamless, social, and engaging movie discovery platform that makes your viewing experience more interactive and connected. We're driven by passion for entertainment and powered by modern web technologies.",
            },
            {
              title: "💡 What We Offer",
              content: (
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>Create and customize watchlists</li>
                  <li>Share them with friends in real-time</li>
                  <li>View what others are watching</li>
                  <li>Chat and react to your favorite titles</li>
                </ul>
              ),
            },
            {
              title: "🧠 Tech Behind the Magic",
              content:
                "Built using React, Node.js, Express, and MongoDB, our platform is designed for speed, scalability, and an immersive UI experience.",
            },
            {
              title: "🤝 Meet the Team",
              content:
                "We're a group of passionate developers and media enthusiasts working together to deliver an experience you'll love. Have feedback or suggestions? We’d love to hear from you!",
            },
          ].map(({ title, content }, idx) => (
            <section
              key={idx}
              className="bg-[#1a1a1a] hover:bg-[#222] transition rounded-xl p-6 border border-gray-800 shadow-md"
            >
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              <p className="text-gray-400 leading-relaxed">{content}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/contact"
            className="inline-block bg-[#E50914] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#bf0810] transition"
          >
            Get in Touch
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
