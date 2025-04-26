const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String
  },
  friends: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },
  pending_requests: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  requests_sent: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  about: {
    type: String,
  },
  gender: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  dob: {
    type: Date,
  },
  watchlists: [
    {
      watchlist_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Watchlist",
        required: true,
        index: true,
      },
      title: {
        type: String,
        required: true,
        maxlength: 50,
      },
      owner: {
        type: Boolean,
        default: false,
      },
    },
  ],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  timeStamp: {
    type: Date,
  },
});

// Hhash passwd
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
