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
        return <div className="flex align-middle justify-center"><LogOut /></div>;
      default:
        return <Error />;
    }
  };

  return (
    curUser && (
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 p-5 flex flex-col justify-between shadow-lg">
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">Menu</h2>
            <ul>
              {["Profile", "Friend Requests", "Messages", "Friend Activity", "Dashboard", "Logout"].map((section) => (
                <li
                  key={section}
                  className={`p-3 my-2 flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeSection === section
                      ? "bg-blue-500 text-white shadow-md"
                      : "hover:bg-gray-700 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {section === "Profile" ? (
                    <ImProfile />
                  ) : section === "Friend Requests" ? (
                    <FaUserFriends />
                  ) : section === "Messages" ? (
                    <SiGooglemessages />
                  ) : section === "Friend Activity" ? (
                    <LuActivity />
                  ) : section === "Dashboard" ? (
                    <MdDashboard />
                  ) : (
                    <RiLogoutBoxFill />
                  )}
                  <span>{section}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">{activeSection}</h1>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">{renderContent()}</div>
        </div>
      </div>
    )
  );
};

export default Sidebar;
