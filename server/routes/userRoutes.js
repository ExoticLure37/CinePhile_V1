const express = require("express")
const { authUser } = require("../middleware/authMiddleware");
const { register, login, resetPassword } = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/reset-password", authUser, resetPassword);

module.exports = router;