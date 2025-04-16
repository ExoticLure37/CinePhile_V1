const express = require("express");
const { authUser } = require("../middleware/authMiddleware");
const {
  register,
  login,
  verifyToken,
  addFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  searchFriend,
  getPendingRequest,
  getRequestSent,
  getFriends,
  updatePersonalDetails,
  updateEmail,
  verifyEmail,
  updatePassword,
  updateUsername,
  getProfile,
  contact,
} = require("../controllers/userControllers");

const router = express.Router();

router.get("/verify/:token", verifyToken);
router.post("/register", register);
router.post("/login", login);
router.get("/search", searchFriend);
router.get("/pendingRequests", authUser, getPendingRequest);
router.get("/requestSent", authUser, getRequestSent);
router.get("/getFriends", authUser, getFriends);
router.patch("/addFriend", authUser, addFriend);
router.patch("/acceptFriendRequest", authUser, acceptFriendRequest);
router.patch("/rejectFriendRequest", authUser, rejectFriendRequest);
router.patch("/cancelFriendRequest", authUser, cancelFriendRequest);
router.patch("/removeFriend", authUser, removeFriend);
router.patch("/updatePersonalDetails", authUser, updatePersonalDetails);
router.patch("/updateEmail", authUser, updateEmail);
router.patch("/updatePassword", authUser, updatePassword);
router.patch("/updateUsername", authUser, updateUsername);
router.get("/getProfile/:userId", getProfile);
router.patch("/verify/:newEmail/:userId", verifyEmail);
router.post("/contact", authUser, contact);

module.exports = router;
