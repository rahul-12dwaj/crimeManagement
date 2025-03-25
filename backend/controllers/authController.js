const User = require("../models/user");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// ✅ Utility: Send Email Function
const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject, text: message });
  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Failed to send email. Please try again later.");
  }
};

// ✅ Register User
exports.register = async (req, res) => {
  try {
    const { name, aadhaar, mobile, email, address, password } = req.body;

    // ❌ Validate Required Fields
    if (!name || !aadhaar || !mobile || !email ||!address || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ❌ Check if Email Already Exists
    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ error: "User with this email already exists." });

    // ✅ Save User
    user = new User({ name, aadhaar, mobile, email, address, password });
    await user.save();

    res.status(201).json({ message: "Registration successful! You can now log in." });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};

// ✅ Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ❌ Validate Fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // ❌ Check If User Exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found. Please register first." });

    // ❌ Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password. Please try again." });

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};

// ✅ Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // ❌ Validate Email
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    await user.save();

    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Failed to send OTP. Please try again later." });
  }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // ❌ Validate Inputs
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP, and new password are required." });
    }

    const user = await User.findOne({ email, resetOtp: otp });
    if (!user) return res.status(400).json({ error: "Invalid OTP or email." });

    // ✅ Hash and Save New Password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully! You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};



// ✅ Register Admin
// ✅ Register Admin


exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions, role, roleDesignation, officerId, department, branch } = req.body;

    // Validate Required Fields
    if (!name || !email || !password || !roleDesignation || !officerId || !department || !branch) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if Admin with Email Already Exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(409).json({ error: "Admin with this email already exists." });
    }

    // Create a new Admin document without hashing the password here
    admin = new Admin({
      name,
      email,
      password, // Password will be hashed in the model's pre-save hook
      permissions: permissions || ["manage_users", "view_reports"], // Default permissions
      role: role || "admin", // Default to "admin" role if not provided
      roleDesignation,
      officerId,
      department,
      branch,
    });

    // Save the Admin to the database
    await admin.save();

    // Send success response
    res.status(201).json({ message: "Admin registration successful!" });
  } catch (error) {
    console.error("Admin Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};


exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: "Admin not found." });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password." });

    // Generate JWT Token, including user role from the database
    const token = jwt.sign(
      { id: admin._id, role: admin.role }, // Use the role from the database
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send the token and user data (such as id and role)
    res.status(200).json({
      message: "Admin login successful!",
      token,
      user: {
        id: admin._id,    // User ID
        role: admin.role, // User role
        email: admin.email // User email
      }
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};





