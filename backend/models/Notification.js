const mongoose = require("mongoose");
const Counter = require("./counterModel");

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
  },
  { timestamps: true }
);

// Middleware to auto-increment refNo before saving
notificationSchema.pre("save", async function (next) {
  if (!this.refNo) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "notification" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Create if it doesn't exist
      );
      this.refNo = counter.seq;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
