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
            withCredentials: true ,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold text-white mb-4">Edit Email</h2>
        <form onSubmit={handleSave}>
          <div className="mb-7">
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700"
              required
            />
          </div>
          <div className="mb-5 mt-4 flex items-center justify-between">
            <p className="text-gray-400">Verification Status:</p>
            {verificationStatus ? (
              <span className="text-green-400">Verified ✅</span>
            ) : (
              <span className="text-red-400">Not Verified ❌</span>
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {isVerifying ? "Sending..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
