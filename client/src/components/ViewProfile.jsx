import { useSelector } from "react-redux";
import { useState } from "react";
import IconBtn from "./IconBtn";
import EditPersonalDetailsModal from "./EditPersonalDetailsModal";
import EditAccountSettingsModal from "./EditAccountSettingsModal";
import profileimage from "../image/photo.jpg";

export default function ViewProfile() {
  const user = useSelector((state) => state.userProfile);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  console.log("showPersonalModal:", showPersonalModal);
  console.log("showAccountModal:", showAccountModal);

  const formatDate = (isoString) => {
    const date = new Date(isoString); // Parse ISO string
    const day = String(date.getDate()).padStart(2, '0');    // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(2);       // Get last two digits of the year
    return `${day}/${month}/${year}`; // Format as dd/mm/yy
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="mb-10 text-4xl font-bold text-white">My Profile</h1>

      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-6">
          <img
            src={profileimage}
            alt={`profile-${user.fullname}`}
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
          />
          <div>
            <p className="text-2xl font-semibold text-white">{user.fullname}</p>
            <p className="text-sm text-gray-400">
              {user.gender || "Not Provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="my-10 bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-semibold text-white">Personal Details</p>
          <IconBtn text="Edit" onClick={() => setShowPersonalModal(true)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-200">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="text-lg font-medium">{user.fullname}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Gender</p>
            <p className="text-lg font-medium">
              {user.gender || "Not Provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Date of Birth</p>
            <p className="text-lg font-medium">{formatDate(user.dob) || "Not Provided"}</p>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-400">About</p>
          {user.about}
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-semibold text-white">Account Settings</p>
          <IconBtn text="Edit" onClick={() => setShowAccountModal(true)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-200">
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-lg font-medium">{user.email || "Not Provided"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Phone Number</p>
            <p className="text-lg font-medium">{user.phone_number || "Not Provided"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">User ID</p>
            <p className="text-lg font-medium">
              {user.username || "Not Provided"}
            </p>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showPersonalModal && (
        <EditPersonalDetailsModal
          onClose={() => setShowPersonalModal(false)}
          user={user}
        />
      )}
      {showAccountModal && (
        <EditAccountSettingsModal
          onClose={() => setShowAccountModal(false)}
          user={user}
        />
      )}
    </div>
  );
}

