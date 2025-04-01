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
      className="p-2 rounded-full hover:bg-gray-700 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="white"
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
    <div className="max-w-4xl mx-auto p-6">
      {/* <h1 className="mb-10 text-4xl font-bold text-white">My Profile</h1> */}

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
              {user.gender || "Lesbian"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Date of Birth</p>
            <p className="text-lg font-medium">
              {formatDate(user.dob) || "Not Provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4 ">
          <p className="text-xl font-semibold text-white">Account Settings</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 text-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex">
                <p className="text-m text-gray-400">Email</p>
                <EditIcon onClick={() => setShowEmailModal(true)} />
              </div>
              <p className="text-lg font-medium">
                {user.email || "Not Provided"}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex">
                <p className="text-m text-gray-400">Phone Number</p>
                <EditIcon onClick={() => setShowPhoneModal(true)} />
              </div>
              <p className="text-lg font-medium">
                {user.phone_number || "Not Provided"}
              </p>
            </div>
          </div>
          <div className="mb-6">
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
