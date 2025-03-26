const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

// Route to add a new notification
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    // Create a new notification (refNo is auto-generated in the model)
    const newNotification = new Notification({ title, message });

    await newNotification.save();
    res.status(201).json({ message: "Notification added successfully", notification: newNotification });
  } catch (error) {
    console.error("Error adding notification:", error);
    res.status(500).json({ message: "Server error, try again later" });
  }
});

// ➤ Fetch All Previous Notifications
router.get("/existing-notification", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications", error });
  }
});

// ➤ Delete a Notification by ID
router.delete("/delete-notification/:id", async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
    if (!deletedNotification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete notification", error });
  }
});

module.exports = router;
