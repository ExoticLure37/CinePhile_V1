import React, { useState } from "react";
import axios from "axios";

export default function EditEmailModal({ onClose, user }) {
  const [newEmail, setNewEmail] = useState(user.email);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(user.isEmailVerified);
  const [error, setError] = useState(null); // To handle any errors

  const handleSave = async (e) => {
    e.preventDefault();

    if (newEmail !== user.email) {
      try {
        setIsVerifying(true);
        setError(null);

        // error 
        const response = await axios.post(
          `http://localhost:5000/user/updateEmail`,
          {
            userId: user.id,
            withCredentials: true,
            newEmail: newEmail,
          }
        );
        alert("Verification link sent to new email!");

        setVerificationStatus(false);

      } catch (error) {
        setError("Error updating email. Please try again.");
        console.error("Error updating email:", error);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#1e1e1e] text-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-2xl font-bold mb-5 text-center">Edit Email</h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">New Email Address</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter new email"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Verification Status:</span>
            {verificationStatus ? (
              <span className="text-green-400 font-medium">Verified ✅</span>
            ) : (
              <span className="text-red-400 font-medium">Not Verified ❌</span>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-300 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-50"
            >
              {isVerifying ? "Sending..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}
