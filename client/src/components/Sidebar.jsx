import { useState } from "react";
import React from "react";
//import { FaHome } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaClipboardList } from "react-icons/fa";
import { SiGooglemessages } from "react-icons/si";
import { LuActivity } from "react-icons/lu";
import { RiLogoutBoxFill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import Error from "./Error";
import ViewProfile from "./ViewProfile";
import LogOut from "./LogOut";
import FriendRequests from "./FriendRequests";
const Sidebar = () => {
  const [activeSection, setActiveSection] = useState("Profile");

  const renderContent = () => {
    switch (activeSection) {
      case "Profile":
        return <p className="text-lg"><ViewProfile /></p>;
      case "Friend Requests":
        return <FriendRequests />
      case "WatchList":
        return <p className="text-lg">View recent activities here.</p>;
      case "Messages":
        return <p className="text-lg">View recent activities here.</p>;
      case "Friend Activity":
        return <p className="text-lg">View recent activities here.</p>;
      case "Dashboard":
        return <p className="text-lg">View recent activities here.</p>;
      case "Logout":
        return <div className="flex align-middle justify-center">
          <LogOut />
        </div>;
      default:
        return <Error />;
    }
  };
  const curUser = useSelector((state) => state.userProfile);
  console.log(curUser);
  return (
    curUser && (
      <div className="flex flex-col bg-[#141414]">
        <div className="mx-auto">
        </div>
        <div className="flex flex-row">
          <div>
            <ul>
              {[
                "Profile",
                "Friend Requests",
                "WatchList",
                "Messages",
                "Friend Activity",
                "Dashboard",
                "Logout",
              ].map((section) => (
                <li
                  key={section}
                  className={`p-3 cursor-pointer rounded-lg hover:bg-gray-200 ${activeSection === section ? "bg-gray-300" : ""
                    }`}
                  onClick={() => setActiveSection(section)}
                >
                  <div className="flex items-center gap-2">
                    {section == "Profile" ? (
                      <ImProfile />
                    ) : section == "Friend Requests" ? (
                      <FaUserFriends />
                    ) : section == "WatchList" ? (
                      <FaClipboardList />
                    ) : section == "Messages" ? (
                      <SiGooglemessages />
                    ) : section == "Friend Activity" ? (
                      <LuActivity />
                    ) : section == "Dashboard" ? (
                      <MdDashboard />
                    ) : (
                      <RiLogoutBoxFill />
                    )}
                    <h1 className="text-lg">{section}</h1>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <hr />
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold mb-4 text-center">{activeSection}</h1>
            {renderContent()}
          </div>
        </div>
      </div>
    )
  );
};

export default Sidebar;