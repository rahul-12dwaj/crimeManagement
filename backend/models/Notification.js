const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    refNo: {
      type: Number,
      unique: true,
      required: true
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
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", required: true 
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
