const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    email: String,
    password: String,
    token: String,
    createdAt: { type: Date, default: Date.now, expires: 3600 } 
});

const tempUserModel = mongoose.model("TempUser", tempUserSchema);

module.exports = tempUserModel; 