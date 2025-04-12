import { useSelector } from "react-redux";
import { useState } from "react";
import IconBtn from "./IconBtn";
import EditPersonalDetailsModal from "./EditPersonalDetailsModal";
import EditEmailModal from "./EditEmailModal";
import EditPhoneNumberModal from "./EditPhoneNumberModal";
import profileimage from "../image/photo.jpg";

export default function ViewProfile() {
  const user = useSelector((state) => state.userProfile);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  const EditIcon = ({ onClick }) => (
    <button
      onClick={onClick}
      className="ml-2 p-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 3.487a1.25 1.25 0 011.768 0l1.883 1.883a1.25 1.25 0 010 1.768l-9.9 9.9a1.25 1.25 0 01-.884.366H6.25a.75.75 0 01-.75-.75v-3.479a1.25 1.25 0 01.366-.884l9.996-9.996zM15.25 5.75L6.25 14.75v2.5h2.5l9-9-2.5-2.5z"
        />
      </svg>
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-6">
          <img
            src={profileimage}
            alt={`profile-${user.fullname}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
          <div>
            <p className="text-2xl font-bold text-white">{user.fullname}</p>
            <p className="text-sm text-blue-300">{user.gender || "Not Provided"}</p>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="mt-10 bg-[#1f2937]/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Personal Details</h2>
          <IconBtn text="Edit" onClick={() => setShowPersonalModal(true)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-200">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="text-lg font-medium">{user.fullname}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Gender</p>
            <p className="text-lg font-medium">{user.gender || "Not Provided"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Date of Birth</p>
            <p className="text-lg font-medium">
              {user.dob ? formatDate(user.dob) : "Not Provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="mt-8 bg-[#1f2937]/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-200">
          <div>
            <div className="flex items-center mb-1">
              <p className="text-sm text-gray-400">Email</p>
              <EditIcon onClick={() => setShowEmailModal(true)} />
            </div>
            <p className="text-lg font-medium">{user.email || "Not Provided"}</p>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <p className="text-sm text-gray-400">Phone Number</p>
              <EditIcon onClick={() => setShowPhoneModal(true)} />
            </div>
            <p className="text-lg font-medium">{user.phone_number || "Not Provided"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">User ID</p>
            <p className="text-lg font-medium">{user.username || "Not Provided"}</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPersonalModal && (
        <EditPersonalDetailsModal
          onClose={() => setShowPersonalModal(false)}
          user={user}
        />
      )}
      {showEmailModal && (
        <EditEmailModal onClose={() => setShowEmailModal(false)} user={user} />
      )}
      {showPhoneModal && (
        <EditPhoneNumberModal
          onClose={() => setShowPhoneModal(false)}
          user={user}
        />
      )}
    </div>
  );
}
