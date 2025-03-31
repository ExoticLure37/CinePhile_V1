import React from "react";

export default function EditPersonalDetailsModal({ onClose, user }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString); // Parse ISO string
    const day = String(date.getDate()).padStart(2, '0');    // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(2);       // Get last two digits of the year
    return `${day}/${month}/${year}`; // Format as dd/mm/yy
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold text-white mb-4">
          Edit Personal Details
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              defaultValue={user.fullname}
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Gender</label>
            <input
              type="text"
              defaultValue={user.gender}
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">DOB</label>
            <input
              type="text"
              defaultValue={formatDate(user.dob)}
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">About</label>
            <textarea
              value={user.about}
              className="w-full h-full p-2 pb-10 bg-gray-800 text-white rounded-md border border-gray-700"
              
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
