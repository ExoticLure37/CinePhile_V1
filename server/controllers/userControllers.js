const userModel = require("../models/userModel");
const tempUserModel = require("../models/tempUserModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const tokenModel = require("../models/token")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const mongoose = require("mongoose");

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
      fullname: user.fullname,
      email: user.email,
      username: user.username,
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

const addFriend = async (req, res) => {
  try {
    const _id = req.user._id;
    const { friendsId } = req.body;

    const isFriends = await userModel.findOne({
      _id: friendsId,
      friends: { $elemMatch: { _id: friendsId } },
    });

    if (isFriends) return res.status(400).json({ message: "Already friends" });

    const isRequestPending = await userModel.findOne({
      _id: friendsId,
      requests_sent: { $elemMatch: { _id: friendsId } },
    });

    if (isRequestPending)
      return res.status(400).json({ message: "Request already sent" });

    const user = await userModel.findOne({
      _id: _id,
    });

    user.requests_sent.push({ _id: friendsId });

    await user.save();

    const targetUser = await userModel.findOne({ _id: friendsId });

    targetUser.pending_requests.push({ _id: _id });

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
    const _id = req.user._id;

    const { friendId } = req.body;

    await userModel.findByIdAndUpdate(_id, {
      $pull: { pending_requests: friendId },
      $push: { friends: { _id: friendId } },
    });

    await userModel.findByIdAndUpdate(friendId, {
      $pull: { requests_sent: _id },
      $push: { friends: { _id: _id } },
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
    const _id = req.user._id;

    const { friendId } = req.body;

    await userModel.findByIdAndUpdate(_id, {
      $pull: { pending_requests: friendId },
    });

    await userModel.findByIdAndUpdate(friendId, {
      $pull: { requests_sent: _id },
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
    const _id = req.user._id;

    const { friendId } = req.body;

    await userModel.findByIdAndUpdate(_id, {
      $pull: { requests_sent: friendId },
    });

    await userModel.findByIdAndUpdate(friendId, {
      $pull: { pending_request: _id },
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
    const _id = req.user._id;

    const { friendId } = req.body;

    await userModel.findByIdAndUpdate(_id, {
      $pull: { friends: friendId },
    });

        await userModel.findByIdAndUpdate(friendId, {
            $pull: { friends: _id }
        })

        return res.status(200).json({ message: "Friend request rejected" })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

const searchFriend = async (req, res) => {
    try {
        const id = req.query.id;
        const username = req.query.username;

        if(id && !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }
        const user = await userModel.findOne({
            $or: [{ _id: id }, { username: username }]
        }).select("_id fullname username email");
        
        // console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


module.exports = {
    register, login, resetPassword, verifyToken,
    addFriend, acceptFriendRequest, rejectFriendRequest,
    cancelFriendRequest, removeFriend,searchFriend
};
