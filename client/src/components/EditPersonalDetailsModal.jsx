import React, { useState } from "react";

export default function EditPersonalDetailsModal({ onClose, user }) {
  const [formData, setFormData] = useState({
    fullname: user.fullname || "",
    gender: user.gender || "",
    dob: user.dob || "",
    about: user.about || "",
  });

  const formatForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().split("T")[0]; // extracting
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (token) {
      document.cookie = `token=${token}; path=/`; // This sets the token as a cookie
    }

    try {
      const response = await fetch(
        "http://localhost:5000/user/updatePersonalDetails",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Update Successful:", data);
        onClose();
      } else {
        console.error("Error Updating:", data.message);
      }
    } catch (error) {
      console.error("Network Error:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold text-white mb-4">
          Edit Personal Details
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Gender</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">DOB</label>
            <input
              type="date"
              name="dob"
              value={formatForInput(formData.dob)}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full h-24 p-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 rounded-md text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
