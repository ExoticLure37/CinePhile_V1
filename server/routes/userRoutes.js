const express = require("express");
const { authUser } = require("../middleware/authMiddleware");
const { register, login, resetPassword, verifyToken, addFriend, getFriends, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest,
    removeFriend, searchFriend, getPendingRequest, getRequestSent, updatePersonalDetails, updateEmail, verifyEmail, 
    updatePassword, updateUsername, getProfile, contact, uploadProfilePicture } = require("../controllers/userControllers");
const upload = require("../middleware/upload");


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
router.get("/verify/:newEmail/:userId", verifyEmail);
router.post("/contact", authUser, contact);
router.patch("/verify/:newEmail/:userId", verifyEmail);
router.post("/contact", authUser, contact);

router.post("/upload-profile-picture", upload.single('profilePic'), uploadProfilePicture);
module.exports = router;
