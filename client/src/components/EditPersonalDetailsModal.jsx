import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditPersonalDetailsModal({ onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({
    fullname: user.fullname || "",
    gender: user.gender || "",
    dob: user.dob || "",
    about: user.about || "",
  });

  const formatForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) document.cookie = `token=${token}; path=/`;

    try {
      const { data } = await axios.patch(
        "http://localhost:5000/user/updatePersonalDetails",
        formData,
        { withCredentials: true }
      );
      onUpdate(data);
      onClose();
      toast.success("Information Updated", { theme: "dark" });
    } catch (err) {
      console.error(err);
      toast.error("Update failed", { theme: "dark" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="w-full max-w-xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-2 border-blue-800 rounded-2xl p-6 text-white shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-blue-400 mb-6">
          Edit Personal Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-y-4 gap-x-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full min-w-0 flex-1 p-2 bg-[#2c3e50] rounded-lg border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">DOB</label>
              <input
                type="date"
                name="dob"
                value={formatForInput(formData.dob)}
                onChange={handleChange}
                className="w-full min-w-0 flex-1 p-2 bg-[#2c3e50] rounded-lg border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full min-w-0 flex-1 p-2 bg-[#2c3e50] rounded-lg border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">About</label>
            <textarea
              name="about"
              rows={4}
              value={formData.about}
              onChange={handleChange}
              className="w-full p-2 bg-[#2c3e50] rounded-lg border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-600 resize-none"
            />
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-gray-300 bg-[#444f5b] rounded-lg hover:bg-[#3b434b] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
