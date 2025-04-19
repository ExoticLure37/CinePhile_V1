import { useState } from "react";
import React from "react";
import { ImProfile } from "react-icons/im";
import { FaUserFriends, FaClipboardList } from "react-icons/fa";
import { SiGooglemessages } from "react-icons/si";
import { LuActivity } from "react-icons/lu";
import { RiLogoutBoxFill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
import Error from "./Error";
import ViewProfile from "./ViewProfile";
import LogOut from "./LogOut";
import FriendRequests from "./FriendRequests";

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const curUser = useSelector((state) => state.userProfile);

  const renderContent = () => {
    switch (activeSection) {
      case "Profile":
        return <ViewProfile />;
      case "Friend Requests":
        return <FriendRequests />;
      case "Messages":
        return <p className="text-lg">View recent messages here.</p>;
      case "Friend Activity":
        return <p className="text-lg">See what your friends are up to.</p>;
      case "Dashboard":
        return <p className="text-lg">Dashboard overview.</p>;
      case "Logout":
        return (
          <div className="flex align-middle justify-center">
            <LogOut />
          </div>
        );
      default:
        return <Error />;
    }
  };

  return (
    curUser && (
      <div className="flex h-screen bg-gradient-to-tr from-[#1f1f1f] to-[#2c2c2c] text-white">
        {/* Sidebar */}
        <div className="w-64 p-6 bg-gradient-to-b from-gray-950 to-gray-900 border-r border-gray-800 shadow-2xl flex flex-col justify-between sticky top-0 h-screen">
          <div>
            <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400 tracking-wider">
              🎬 Menu
            </h2>
            <ul>
              {[
                "Profile",
                "Friend Requests",
                "Messages",
                "Friend Activity",
                "Dashboard",
                "Logout",
              ].map((section) => (
                <li
                  key={section}
                  className={`p-3 my-2 flex items-center gap-4 rounded-xl text-base font-medium tracking-wide cursor-pointer transition-all duration-200 ${activeSection === section
                      ? "bg-blue-600 text-white shadow-inner ring-2 ring-yellow-400 scale-[1.02]"
                      : "hover:bg-gray-800 hover:text-yellow-400"
                    }`}
                  onClick={() => setActiveSection(section)}
                >
                  {section === "Profile" ? (
                    <ImProfile className="text-xl" />
                  ) : section === "Friend Requests" ? (
                    <FaUserFriends className="text-xl" />
                  ) : section === "Messages" ? (
                    <SiGooglemessages className="text-xl" />
                  ) : section === "Friend Activity" ? (
                    <LuActivity className="text-xl" />
                  ) : section === "Dashboard" ? (
                    <MdDashboard className="text-xl" />
                  ) : (
                    <RiLogoutBoxFill className="text-xl text-red-400" />
                  )}
                  <span>{section}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-gray-500 text-center mt-6 tracking-wide">
            © 2025 ProjectV
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-10 py-8 overflow-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-white tracking-wide">
            {activeSection}
          </h1>
          <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-700 min-h-[70vh] transition-all">
            {renderContent()}
          </div>
        </div>
      </div>
    )
  );
};

export default Sidebar;
