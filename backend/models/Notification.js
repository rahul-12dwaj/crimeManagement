const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    refNo: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically stores the date and time
    },
  },
  { timestamps: true } // This adds createdAt and updatedAt automatically
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
