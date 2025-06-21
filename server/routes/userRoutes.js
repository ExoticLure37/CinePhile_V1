const express = require("express");
const { authUser } = require("../middleware/authMiddleware");
const {
  register,
  login,
  resetPassword,
  verifyToken,
  addFriend,
  getFriends,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  searchFriend,
  getPendingRequest,
  getRequestSent,
  updatePersonalDetails,
  updateEmail,
  verifyEmail,
  updatePassword,
  updateUsername,
  getProfile,
  contact,
  uploadProfilePicture,
  getFavoritedWatchlists,
  forgotPassword,
  resetforgotPassword,
} = require("../controllers/userControllers");
const upload = require("../middleware/upload");

const router = express.Router();


// token verification  
router.get("/verify/:token", verifyToken);

// for user registration
router.post("/register", register);

// for user login 
router.post("/login", login);

// search user to make friend
router.get("/search", searchFriend);

// get pending friend requests to user
router.get("/pendingRequests", authUser, getPendingRequest);

// get friend requests sent by user
router.get("/requestSent", authUser, getRequestSent);

// get all frinds 
router.get("/getFriends", authUser, getFriends);

// add friend -- send request 
router.patch("/addFriend", authUser, addFriend);

// accept req
router.patch("/acceptFriendRequest", authUser, acceptFriendRequest);

// reject req
router.patch("/rejectFriendRequest", authUser, rejectFriendRequest);

// cancle pending req not yet accepted
router.patch("/cancelFriendRequest", authUser, cancelFriendRequest);

// remove frind
router.patch("/removeFriend", authUser, removeFriend);

// update deatils
router.patch("/updatePersonalDetails", authUser, updatePersonalDetails);

//forgot pass
router.patch("/updateEmail", authUser, forgotPassword);

// update pass 
router.patch("/updatePassword", authUser, updatePassword);

// update name 
router.patch("/updateUsername", authUser, updateUsername);

// get user profile
router.get("/getProfile/:userId", getProfile);

// verigy email
router.get("/verify/:newEmail/:userId", verifyEmail);

// contact api
router.post("/contact", authUser, contact);

// TODO(): check why its there  - use of upadte email too
router.patch("/verify/:newEmail/:userId", verifyEmail);

// get favorited wacthlists
router.get("/favorites", authUser, getFavoritedWatchlists);

// upload profile-pic
router.post(
  "/upload-profile-picture",
  authUser,
  upload.single("profilePic"),
  uploadProfilePicture
);

//forgot password routes
router.post("/forgot-password", authUser, forgotPassword);
router.post("/reset-password/:token", authUser, resetforgotPassword);

module.exports = router;
