import React from "react";

export default function EditPhoneNumberModal({ onClose, user }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold text-white mb-4">
          Edit Phone Number
        </h2>
        <form>
          <div className="mb-7">
            <label className="block text-gray-400 mb-2">Phone Number</label>
            <input
              type="text"
              defaultValue={user.phone_number}
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700"
            />
          </div>
          <div className="mb-5 mt-4 flex items-center justify-between">
            <p className="text-gray-400">Verification Status:</p>
            {user.isPhoneVerified ? (
              <span className="text-green-400">Verified ✅</span>
            ) : (
              <span className="text-red-400">Not Verified ❌</span>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="text-gray-300 hover:text-white">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}