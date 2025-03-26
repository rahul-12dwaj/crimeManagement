const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// ➤ Add New Notification
router.post("/add", async (req, res) => {
  try {
    const { title, message, refNo } = req.body;

    // ✅ Check if refNo Already Exists
    let existingNotification = await Notification.findOne({ refNo });
    if (existingNotification) {
      return res.status(409).json({
        success: false,
        message: "Notification with this reference number already exists.",
      });
    }

    const newNotification = new Notification({ title, message, refNo });
    await newNotification.save();

    res.status(201).json({
      success: true,
      message: "Notification added successfully",
      notification: newNotification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add notification",
      error: error.message,
    });
  }
});

// ➤ Fetch All Previous Notifications
router.get("/existing-notification", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
});

// ➤ Delete a Notification by ID
router.delete("/delete-notification/:id", async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
    if (!deletedNotification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
});

module.exports = router;
