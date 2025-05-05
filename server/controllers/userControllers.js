const userModel = require("../models/userModel");
const tempUserModel = require("../models/tempUserModel");
const contactModel = require("../models/contactModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const tokenModel = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const mongoose = require("mongoose");
const uploadOnCloundinary = require("../utils/cloudinary");
const favoriteModel = require("../models/favoriteModel");
const watchListModel = require("../models/watchListModel")

// const redisClient = require("../utils/redisClient");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const register = async (req, res) => {
  // console.log("HELLO")
  try {
    // console.log("Received Data:", req.body);
    const { fullname, username, email, password } = req.body;

    const userEmail = await userModel.findOne({ email: email });

    if (userEmail)
      return res.status(400).json({ message: "Email already exists!!" });

    const userName = await userModel.findOne({ username: username });

    if (userName)
      return res.status(400).json({ message: "Username already exists!!" });

    if (!fullname || !username || !email || !password)
      return res.status(400).json({ message: "All fields are required!!" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Not a valid email!!" });
    if (!validator.isStrongPassword(password))
      return res.status(400).json({ message: "Weak Password!!" });

    const token = crypto.randomBytes(32).toString("hex");

    // await redisClient.setEx(`verify:${token}`, 3600, JSON.stringify({ fullname, username, email, password }));//expires in x time
    await tempUserModel.create({ fullname, username, email, password, token });
    // await userModel.create({ fullname, username, email, password });

    const url = `${process.env.BASE_URL}/user/verify/${token}`;

    await sendEmail(email, "Verify Your Email", url);

    res
      .status(201)
      .json({ message: "Verification email sent to your registered email!!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    const token = req.params.token;
    // const userData = await redisClient.get(`verify:${token}`);
    const userData = await tempUserModel.findOne({ token });
    if (!userData)
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link!" });

    const { fullname, username, email, password } = userData;

    await userModel.create({ fullname, username, email, password });

    //remove data from Redis after verification
    // await redisClient.del(`verify:${token}`);

    return res
      .status(200)
      .json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await userModel.findOne({ email: email });

    if (!user) return res.status(400).json({ message: "No email exists!!" });

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword)
      return res.status(400).json({ message: "Wrong Password!!!" });

    const tokenExpiry = rememberMe ? "7d" : "1d";

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: tokenExpiry,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      about: user.about,
      gender: user.gender,
      dob: user.dob,
      phone_number: user.phone_number,
      profilePic: user.profilePic
    });
  } catch (er) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: er.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const _id = req.user._id;
    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) return res.status(400).json({ message: "Wrong Password!!!" });

    if (!validator.isStrongPassword(newPassword))
      return res.status(400).json({ message: "New password is weak!!" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user and populate friends' usernames
    const user = await userModel
      .findById(userId)
      .populate("friends._id", "username");

    // Create an array with friends and their usernames
    const friendList = user.friends.map((friend) => ({
      username: friend.username,
      _id: friend._id,
    }));

    return res.status(200).json({ friendList });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const addFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendsId } = req.body;

    // console.log(userId);
    // console.log(friendsId);

    const friend = await userModel.findOne(
      mongoose.Types.ObjectId.isValid(friendsId)
        ? { _id: friendsId }
        : { username: friendsId }
    );

    // console.log(friend)

    if (!friend)
      return res.status(400).json({ message: "Username doesn't exists!!" });

    const friendId = friend._id.toString();

    // console.log(friendId)

    const isFriends = await userModel.findOne({
      _id: userId,
      friends: { $elemMatch: { _id: friendId } },
    });

    // console.log(isFriends)

    if (isFriends)
      return res.status(400).json({ message: "Already friends!!!" });

    const isRequestPending = await userModel.findOne({
      _id: userId,
      requests_sent: { $elemMatch: { _id: friendId } },
    });

    // console.log(isRequestPending)

    if (isRequestPending)
      return res.status(400).json({ message: "Request already sent" });

    const user = await userModel.findOne({
      _id: userId,
    });

    user.requests_sent.push({ _id: friendId });

    await user.save();

    const targetUser = await userModel.findOne({ _id: friendId });

    targetUser.pending_requests.push({ _id: userId });

    await targetUser.save();

    return res
      .status(200)
      .json({ message: "Friend request sent successfully!!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const id = req.user._id;

    const { friendId } = req.body;

    await userModel.findByIdAndUpdate(id, {
      $pull: { pending_requests: { _id: friendId } },
      $push: { friends: { _id: friendId } },
    });

    await userModel.findByIdAndUpdate(friendId, {
      $pull: { requests_sent: { _id: id } },
      $push: { friends: { _id: id } },
    });

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const id = req.user._id;

    const { friendId } = req.body;

    // console.log(friendId)

    await userModel.findByIdAndUpdate(id, {
      $pull: { pending_requests: { _id: friendId } },
    });

    await userModel.findByIdAndUpdate(friendId, {
      $pull: { requests_sent: { _id: id } },
    });

    return res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const cancelFriendRequest = async (req, res) => {
  try {
    const id = req.user._id;

    const { friendId } = req.body;

    // console.log(friendId)

    await userModel.findByIdAndUpdate(id, {
      $pull: { requests_sent: { _id: friendId } },
    });

    await userModel.findByIdAndUpdate(friendId, {
      $pull: { pending_requests: { _id: id } },
    });

    return res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const removeFriend = async (req, res) => {
  try {
    const id = req.user._id;

    // console.log(_id)

    const { friendId } = req.body;

    // console.log(friendId)

    await userModel.findByIdAndUpdate(id, {
      $pull: { friends: { _id: friendId } },
    });

    await userModel.findByIdAndUpdate(friendId, {
      $pull: { friends: { _id: id } },
    });

    return res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const searchFriend = async (req, res) => {
  try {
    const username = req.query.username;

    // console.log(username);

    const user = await userModel
      .findOne({
        username: username,
      })
      .select("_id fullname username email");

    // console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getPendingRequest = async (req, res) => {
  try {
    const _id = req.user._id;

    // Fetch user and populate usernames in one query
    const user = await userModel
      .findOne({ _id })
      .populate("pending_requests._id", "username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract request list
    const requestSentList = user.pending_requests.map((request) => ({
      userId: request._id._id, // Extract ObjectId correctly
      username: request._id.username, // Extract username correctly
    }));

    // console.log(requestSentList);

    return res.status(200).json({ pending_requests: requestSentList });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getRequestSent = async (req, res) => {
  try {
    const _id = req.user._id;

    // Fetch user and populate usernames in one query
    const user = await userModel
      .findOne({ _id })
      .populate("requests_sent._id", "username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract request list
    const requestSentList = user.requests_sent.map((request) => ({
      userId: request._id._id, // Extract ObjectId correctly
      username: request._id.username, // Extract username correctly
    }));

    // console.log(requestSentList);

    return res.status(200).json({ requests_sent: requestSentList });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const updatePersonalDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullname, gender, dob, about } = req.body;

    const user = await userModel.findById(userId);

    if (fullname) user.fullname = fullname;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (about) user.about = about;

    await user.save();
    console.log(user);
    return res.status(200).json({
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      about: user.about,
      gender: user.gender,
      dob: user.dob,
      phone_number: user.phone_number,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Serve Error", error: err.message });
  }
};

const updateEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newEmail } = req.body;

    const url = `${process.env.BASE_URL}/user/verify/${newEmail}/${userId}`;

    await sendEmail(newEmail, "Verify Your Email", url);

    return res.status(200).json("Verfication link sent to your new e-mail!!");
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Serve Error", error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { newEmail, userId } = req.params;

    const user = await userModel.findByIdAndUpdate(userId, { email: newEmail });

    return res.status(200).json({ email: user.email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Serve Error", error: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;

    const { newPassword, oldPassword } = req.body;

    const user = await userModel.findById(userId);

    // console.log(user);

    const decryptedPass = await bcrypt.compare(oldPassword, user.password);

    if (!decryptedPass)
      return res.status(400).json({ message: "Incorrect Password!!" });

    // console.log(user);

    if (!validator.isStrongPassword(newPassword))
      return res.status(400).json({ message: "Weak Password!!" });

    user.password = newPassword;

    await user.save();

    return res.status(200).json({ message: "Password updated sucessfully!!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Serve Error", error: err.message });
  }
};

const updateUsername = async (req, res) => {
  try {
    const userId = req.user._id;

    const { newUsername } = req.body;

    const user = await userModel.findById(userId);

    const storedDate = user.timeStamp;

    const currentDate = new Date(); // Current date

    // Calculate difference in milliseconds
    const differenceInMilliseconds = Math.abs(currentDate - storedDate);

    // Convert to days
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays < 90)
      return res.status(400).json({
        message: `You cannot change user until ${90 - differenceInDays} days`,
      });

    const isAlreadyTaken = user.findOne({ username: newUsername });

    if (isAlreadyTaken)
      return res.status(400).json({ message: "Username already taken!!!" });

    user.username = newUsername;
    user.timeStamp = currentDate;

    await user.save();

    return res.status(200).json(user.username);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Serve Error", error: err.message });
  }
  //   catch (err) {
  //     return res.status(500).json({ message: "Internal Serve Error", error: err.message })
  //   }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log("UserID received:", userId);

    const user = await userModel.findOne(
      mongoose.Types.ObjectId.isValid(userId)
        ? { _id: userId }
        : { username: userId }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // console.log(user)

    return res.status(200).json({
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      about: user.about,
      gender: user.gender,
      dob: user.dob,
      phone_number: user.phone_number,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error!!", error: err.message });
  }
};

const contact = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate the data
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newContact = new contactModel({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadProfilePicture = async (req, res) => {
  const userId = req.user._id;
  const localPath = req.file.path;

  try {
    // Upload to Cloudinary
    const result = await uploadOnCloundinary(userId, localPath);

    const user = await userModel.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    );

    res.json({ success: true, profilePic: result.secure_url });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Upload to Cloudinary failed" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Not a valid email!!" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 600000; // 2 * 5 * 60 * 1000 milliseconds
    await user.save();

    const resetLink = `${process.env.BASE_URL}/user/reset-password/${token}`;
    await sendEmail(
      email,
      "Reset your password - ProjectV",
      `
         Hey ${user.fullname || user.username}
         You requested a password reset. Click the link below to reset it:
         <a href="${resetLink}">Reset Password</a>
         This link will expire in 10 minutes.
       `
    );

    res.status(200).json({ message: "Reset link sent to your email!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const resetforgotPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token!" });
    }

    user.password = password;
    // Clear the reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    //  console.log("Before save password:", user.password);
    await user.save();
    //  const check = await userModel.findById(user._id);
    //  console.log("After save password:", check.password);

    res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getFavoritedWatchlists = async (req, res) => {
  try {
    const userId = req.user._id;

    // console.log(userId);
    const favorites = await favoriteModel
      .find({ userId })
      .populate("watchlistId", "title favoritesCount")
      .lean();

    const watchlists = favorites.map((fav) => fav.watchlistId);

    return res.status(200).json({ watchlists });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

module.exports = {
  register,
  login,
  resetPassword,
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
  uploadProfilePicture,
  getFavoritedWatchlists,
  resetforgotPassword,
  forgotPassword,
};
