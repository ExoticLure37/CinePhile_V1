const express = require("express")
const { authUser } = require("../middleware/authMiddleware");
const { register, login, resetPassword, verifyToken, addFriend, getFriends, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend, searchFriend, getPendingRequest, getRequestSent } = require("../controllers/userControllers");

const router = express.Router();

router.get("/verify/:token", verifyToken);
router.post("/register", register);
router.post("/login", login);
router.patch("/reset-password", authUser, resetPassword);
router.get("/search", searchFriend);
router.get("/pendingRequests", authUser, getPendingRequest);
router.get("/requestSent", authUser, getRequestSent);
router.get("/search", searchFriend);
router.get("/getFriends", authUser, getFriends);
router.patch("/addFriend", authUser, addFriend)
router.patch("/acceptFriendRequest", authUser, acceptFriendRequest)
router.patch("/rejectFriendRequest", authUser, rejectFriendRequest)
router.patch("/cancelFriendRequest", authUser, cancelFriendRequest)
router.patch("/removeFriend", authUser, removeFriend)

module.exports = router;