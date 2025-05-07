import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import IconBtn from "./IconBtn";
import EditPersonalDetailsModal from "./EditPersonalDetailsModal";
import EditEmailModal from "./EditEmailModal";
import EditPhoneNumberModal from "./EditPhoneNumberModal";
import profileimage from "../image/photo.jpg";
import { setUserProfile } from "../redux/user/userSlice.js";
import { motion } from "framer-motion";

const EditIcon = ({ onClick }) => (
  <button
    onClick={onClick}
    className="ml-2 p-2 rounded-full hover:bg-blue-500 hover:text-white transition duration-200"
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

export default function ViewProfile() {
  const user = useSelector((state) => state.userProfile);
  const dispatch = useDispatch();

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-6 rounded-3xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
      >
        <div className="flex items-center gap-6">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={profileimage}
            alt={`profile-${user.fullname || "user"}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
          <div>
            <p className="text-2xl font-bold text-white">{user.fullname}</p>
            <p className="text-sm text-blue-300">{user.about || "New User"}</p>
          </div>
        </div>
      </motion.div>

      {/* Personal Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-10 bg-[#1f2937]/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Personal Details</h2>
          <IconBtn text="Edit" onClick={() => setShowPersonalModal(true)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-200">
          {[
            { label: "Name", value: user.fullname },
            { label: "Gender", value: user.gender || "Not Provided" },
            {
              label: "Date of Birth",
              value: user.dob ? formatDate(user.dob) : "Not Provided",
            },
          ].map(({ label, value }, idx) => (
            <div
              key={idx}
              className="hover:scale-105 hover:bg-gray-700 p-4 rounded-lg transition-all duration-300 cursor-default"
            >
              <p className="text-sm text-gray-400">{label}</p>
              <p className="text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-[#1f2937]/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
      >
        <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-200">
          <div className="hover:scale-105 hover:bg-gray-700 p-4 rounded-lg transition-all duration-300">
            <div className="flex items-center mb-2">
              <p className="text-sm text-gray-400">Email</p>
              <EditIcon onClick={() => setShowEmailModal(true)} />
            </div>
            <p className="text-lg font-semibold">
              {user.email || "Not Provided"}
            </p>
          </div>

          <div className="hover:scale-105 hover:bg-gray-700 p-4 rounded-lg transition-all duration-300">
            <div className="flex items-center mb-2">
              <p className="text-sm text-gray-400">Phone Number</p>
              <EditIcon onClick={() => setShowPhoneModal(true)} />
            </div>
            <p className="text-lg font-semibold">
              {user.phone_number || "Not Provided"}
            </p>
          </div>

          <div className="hover:scale-105 hover:bg-gray-700 p-4 rounded-lg transition-all duration-300">
            <p className="text-sm text-gray-400">Username</p>
            <p className="text-lg font-semibold">
              {user.username || "Not Provided"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      {showPersonalModal && (
        <EditPersonalDetailsModal
          user={user}
          onClose={() => setShowPersonalModal(false)}
          onUpdate={(updatedUser) => dispatch(setUserProfile(updatedUser))}
        />
      )}
      {showEmailModal && (
        <EditEmailModal user={user} onClose={() => setShowEmailModal(false)} />
      )}
      {showPhoneModal && (
        <EditPhoneNumberModal
          user={user}
          onClose={() => setShowPhoneModal(false)}
        />
      )}
    </div>
  );
}
