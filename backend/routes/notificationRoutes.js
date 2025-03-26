const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// ➤ Add New Notification
router.post("/add", async (req, res) => {
  try {
    const { title, message, refNo } = req.body;
    const newNotification = new Notification({ title, message, refNo });
    await newNotification.save();
    res.status(201).json({ success: true, message: "Notification added successfully", notification: newNotification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add notification", error });
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
router.delete("/existing-notification/:id", async (req, res) => {
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
