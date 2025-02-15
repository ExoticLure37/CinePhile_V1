const express = require("express")
const { authUser } = require("../middleware/authMiddleware");
const { register, login, resetPassword, verifyToken, addFriend, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend,searchFriend } = require("../controllers/userControllers");

const router = express.Router();

router.get("/verify/:token", verifyToken);
router.post("/register", register);
router.post("/login", login);
router.patch("/reset-password", authUser, resetPassword);
router.get("/search",searchFriend);
router.patch("/addFriend", authUser, addFriend)
router.patch("/acceptFriendRequest", authUser, acceptFriendRequest)
router.patch("/rejectFriendRequest", authUser, rejectFriendRequest)
router.patch("/cancelFriendRequest", authUser, cancelFriendRequest)
router.patch("/removeFriend", authUser, removeFriend)

module.exports = router;