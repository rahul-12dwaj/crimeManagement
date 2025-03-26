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

// Auto-generate a unique numeric reference number before saving
notificationSchema.pre("save", async function (next) {
  if (!this.refNo) {
    let lastNotification = await mongoose
      .model("Notification")
      .findOne({}, { refNo: 1 })
      .sort({ refNo: -1 }); // Get the last refNo in descending order

    this.refNo = lastNotification ? lastNotification.refNo + 1 : 1001; // Start from 1001
  }
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
