const userModel = require("../models/userModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const tokenModel = require("../models/token")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const register = async (req, res) => {
    console.log("HELLO")
    try {
        console.log("Received Data:", req.body);
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
            return res.status(400).json({ message: "Weak Password!!" })

        const user = await userModel.create({ fullname, username, email, password });

        const tk = await tokenModel.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
        })

        const url = `${process.env.BASE_URL}/users/${user._id}/verify/${tk.token}`

        await sendEmail(user.email, "Verify Email", url)

        res.status(201).json({ message: "Verification email sent to your registered email!!" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message })
    }
}

const verifyToken = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id })

        if (!user)
            return res.status(400).json({ message: "Invalid Link" });

        const token = await tokenModel.findOne({
            userId: req.params.id,
            token: req.params.token
        })

        if (!token)
            return res.status(400).json({ message: "Invalid Link" })

        await userModel.updateOne({ _id: user._id, verified: true })
        await token.remove();

        return res.status(200).json({ message: "Email verified successfully" })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        const user = await userModel.findOne({ email: email });

        if (!user)
            return res.status(400).json({ message: "No email exists!!" })

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword)
            return res.status(400).json({ message: "Wrong Password!!!" })

        if (!user.verified) {
            const token = await tokenModel.findOne({ userId: user._id })

            if (!token) {
                const tk = await tokenModel.create({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex")
                })

                const url = `${process.env.BASE_URL}/users/${user._id}/verify/${tk.token}`

                await sendEmail(user.email, "Verify Email", url)
            }

            return res.status(400).send({ message: "An email has been sent to your account" })
        }

        const tokenExpiry = rememberMe ? "7d" : "1d";

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: tokenExpiry });

        res.cookie('token', token, {
            httpOnly: true, secure: true,
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ fullname: user.fullname, email: user.email, username: user.username });
    }
    catch (er) {
        return res.status(500).json({ message: "Internal Server Error", error: er.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const _id = req.user._id;
        const user = await userModel.findById(_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) return res.status(400).json({ message: "Wrong Password!!!" })

        if (!validator.isStrongPassword(newPassword))
            return res.status(400).json({ message: "New password is weak!!" });

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

module.exports = { register, login, resetPassword, verifyToken };