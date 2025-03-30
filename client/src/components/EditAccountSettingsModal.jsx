import React from "react";

export default function EditAccountSettingsModal({ onClose, user }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold text-white mb-4">
          Edit Account Settings
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Phone Number</label>
            <input
              type="text"
              defaultValue={user.phone}
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
