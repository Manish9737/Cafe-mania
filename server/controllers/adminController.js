const Admin = require("../models/admin");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
      password,
    });

    await newAdmin.save();

    res.status(200).json({ message: "Admin registered.", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error.", success: false });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if ((!email, !password)) {
      return res
        .status(400)
        .json({ message: "Please fill all fields", success: false });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }

    const token = JWT.sign({ id: admin._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({
      success: true,
      message: "Admin signed in.",
      token: token,
      admin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const adminId = req.admin?.id || req.adminId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

exports.sendEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    if (!to || !subject || !message)
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });

    const result = await sendEmail(to, subject, message);

    if (!result) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send email" });
    }

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};
