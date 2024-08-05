const Admin = require("../models/admin");
const JWT = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const sendEmail = require("../utils/email");

const JWT_SECRET = process.env.SECRET_KEY;

exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {

        const admin = await Admin.findOne({ email });

        if (admin) {
            return res.status(400).json({ error: "Admin already exists" });
        }

        const lastAdmin = await Admin.findOne().sort({ id: -1 });
        const lastId = lastAdmin ? lastAdmin.id : 0;

        const newAdmin = new Admin({
            id: lastId + 1,
            name,
            email,
            password
        })

        await newAdmin.save();

        res.status(200).json({ message: "Admin registered.", success: true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error.", success: false })
    }
}

exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email, !password) {
            return res.status(400).json({ message: 'Please fill all fields', success: false });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found', success: false });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password', success: false });
        }

        const token = JWT.sign({ id: admin._id }, JWT_SECRET, {
            expiresIn: "1h"
        })

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000,
        })

        res.status(200).json({ success: true, message: "Admin signed in.", token: token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

exports.sendEmail = async(req, res) => {
    const { to, subject, message } = req.body;
    // console.log(req.originalUrl)
    try {
        if ( !to || !subject || !message) return res.status(400).json({success: false, message: "Please fill all fields"});

        sendEmail(to, subject, message);
        res.status(200).json({success: true, message: "Email sent successfully"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: "Internal server error !"});
    }
}
