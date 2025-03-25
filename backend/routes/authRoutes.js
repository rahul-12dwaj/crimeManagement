const express = require("express");
const { register, login, forgotPassword, resetPassword, loginAdmin, registerAdmin } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure correct path
const User = require("../models/user");  // Ensure this import is present
const Admin = require('../models/admin'); // Adjust the path to where your Admin model is located



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/register-admin", registerAdmin);
router.post("/login-admin", loginAdmin);

// Protect this route with authentication middleware
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Check if the role is admin or user and fetch the appropriate model
    if (req.user.role === "admin") {
      const admin = await Admin.findById(req.user.id);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      // Remove password and sensitive information from the admin object
      admin.password = undefined; // or delete admin.password
      return res.status(200).json({ user: admin });
    }

    // If it's not an admin, fetch the user model (can be general user or other roles)
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.json({ user });
    
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Server error" });
  }
});


// Route to get all users with their address (Admin only)
router.get("/all-users", authMiddleware, async (req, res) => {
  try {
    // Ensure only admin can access this route
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Fetch all users (excluding password field)
    const users = await User.find().select("name email address role");
    const allUsers = [...users];

    return res.status(200).json({ users: allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT: Update user by ID
router.put("/update-user/:id", authMiddleware, async (req, res) => {
  try {
    const { name, email, role, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, address },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});


// DELETE: Delete user by ID
router.delete("/delete-user/:id", authMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});





module.exports = router;
