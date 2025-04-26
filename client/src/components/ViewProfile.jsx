import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import IconBtn from "./IconBtn";
import EditPersonalDetailsModal from "./EditPersonalDetailsModal";
import EditEmailModal from "./EditEmailModal";
import EditPhoneNumberModal from "./EditPhoneNumberModal";
import profileimage from "../image/photo.jpg";
import { setUserProfile } from "../redux/user/userSlice.js";
import axios from "axios";
// import {toast} from "react-toastify";
// Pencil icon component
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

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();

    formData.append("profilePic", file);

    try {
      const res = await axios.post("http://localhost:5000/user/upload-profile-picture", formData, {
        withCredentials: true, 
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;

      if (data.success) {
        dispatch(setUserProfile({ ...user, profilePic: data.profilePic }))
      } else {
        console.error(data.error);
      }
    }
    catch (err) {
      console.error("Error uploading profile picture:", err);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-6">
          <label className="relative cursor-pointer group">
            <img
              src={user.profilePic || profileimage}
              alt={`profile-${user.fullname || "user"}`}
              className="w-60 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition rounded-full">
              Change
            </div>
            <input type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageUpload} />
          </label>
          <div>
            <p className="text-2xl font-bold text-white">{user.fullname}</p>
            <p className="text-sm text-blue-300">{user.about || "New User"}</p>
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
            <p className="text-lg font-medium">
              {user.gender || "Not Provided"}
            </p>
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
            <p className="text-lg font-medium">
              {user.email || "Not Provided"}
            </p>
          </div>
          <div>
            <div className="flex items-center mb-1">
              <p className="text-sm text-gray-400">Phone Number</p>
              <EditIcon onClick={() => setShowPhoneModal(true)} />
            </div>
            <p className="text-lg font-medium">
              {user.phone_number || "Not Provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">User ID</p>
            <p className="text-lg font-medium">
              {user.username || "Not Provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPersonalModal && (
        <EditPersonalDetailsModal
          user={user}
          onClose={() => setShowPersonalModal(false)}
          onUpdate={(updatedUser) => {
            dispatch(setUserProfile(updatedUser));
          }}
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