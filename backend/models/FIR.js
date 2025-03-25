const mongoose = require("mongoose");

const FIRSchema = new mongoose.Schema({
  crimeType: {
    type: String,
    required: true,
    enum: [
      "Theft",
      "Robbery",
      "Assault",
      "Burglary",
      "Fraud",
      "Murder",
      "Sexual Assault",
      "Vandalism",
      "Kidnapping",
      "Domestic Violence",
      "Drunk Driving",
      "Other",
    ],
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  evidence: {
    type: String, // Store file path or URL (if using cloud storage)
  },
  victimName: {
    type: String,
  },
  witnessName: {
    type: String,
  },
  firNumber: {
    type: String,
    unique: true,
    required: true,
  },
  estimatedTime: {
    type: String, // Example: "7 days for investigation"
  },
  status: {
    type: String,
    enum: ["Pending", "Under Investigation", "Resolved"],
    default: "Pending",
  },
  isArchived: {
    type: Boolean,
    default: false, // Not archived initially
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
  
});

const FIR = mongoose.model("FIR", FIRSchema);

module.exports = FIR;
