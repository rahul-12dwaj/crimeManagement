const express = require("express");
const multer = require("multer");
const FIR = require("../models/FIR");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/authMiddleware");
const fs = require("fs");
const authMiddleware = require("../middleware/authMiddleware");

// Ensure the uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file uploads with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Use timestamp as filename
  },
});

const fileFilter = (req, file, cb) => {
  // Allow only images and PDFs (example validation)
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, and PDF files are allowed"), false);
  }
  cb(null, true); // Accept the file
};

const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } // Max file size 5MB
});

// Generate FIR Number
const generateFIRNumber = () => {
  return `FIR-${uuidv4().slice(0, 8)}`; // Example: FIR-12ab34cd
};

// @route   POST /api/fir/file
// @desc    File a new FIR
// @access  Private
router.post("/file", authenticateUser, async (req, res) => {
  try {
    const { name, contact, address, crimeType, date, time, location, description, victimName, witnessName } = req.body;

    // Check required fields
    if (!name || !contact || !address || !crimeType || !date || !time || !location || !description) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const firNumber = generateFIRNumber();
    const estimatedTime = "7 days"; // Example estimation

    const newFIR = new FIR({
      name,
      contact,
      address,
      crimeType,
      date,
      time,
      location,
      description,
      victimName,
      witnessName,
      firNumber,
      estimatedTime,
      user: req.user.id, // Associate FIR with logged-in user
    });

    await newFIR.save();
    res.status(201).json({ message: "FIR filed successfully", firNumber, estimatedTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Endpoint to get all FIRs from the database
// Endpoint to get all FIRs filed by the logged-in user
router.get('/previous', authenticateUser, async (req, res) => {
  try {
    // Fetch FIRs that belong to the authenticated user
    const firData = await FIR.find({ user: req.user.id }); // Filter by user ID
    res.json(firData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching FIR data.' });
  }
});

// Endpoint to get all FIRs for admin without authentication
router.get("/all", authMiddleware, async (req, res) => {
  try {
    // Check if the logged-in user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch FIRs and populate user details (name, email, contact, etc.)
    const firData = await FIR.find().populate("user", "name aadhaar email mobile address")

    res.status(200).json(firData);
  } catch (error) {
    console.error("Error fetching FIRs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @route   PUT /api/fir/updateStatus/:firNumber
// @desc    Update FIR status by FIR number
// @access  Private (Only Admin can update)
router.put("/updateStatus/:firNumber", authMiddleware, async (req, res) => {
  try {
    const { firNumber } = req.params;
    const { status } = req.body;

    // Ensure only admins can update status
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Find the FIR and update the status
    const updatedFIR = await FIR.findOneAndUpdate(
      { firNumber },
      { $set: { status } },
      { new: true }
    );

    if (!updatedFIR) {
      return res.status(404).json({ message: "FIR not found" });
    }

    res.status(200).json({ message: "FIR status updated successfully", updatedFIR });
  } catch (error) {
    console.error("Error updating FIR status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @route   GET /api/fir/archived
// @desc    Get all resolved FIRs (Archived List)
// @access  Private (Only Admin can view)
// @route   GET /api/fir/resolved
// @desc    Fetch all resolved FIRs (archived)
// @access  Private (Only admins can access)
router.get("/resolved", authMiddleware, async (req, res) => {
  try {
    // Check if the logged-in user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch FIRs where status is "Resolved"
    const resolvedFirs = await FIR.find({ status: "Resolved" }).populate("user", "name aadhaar email mobile address");

    res.status(200).json(resolvedFirs);
  } catch (error) {
    console.error("Error fetching resolved FIRs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// Delete FIR by FIR Number
router.delete("/delete/:firNumber", authMiddleware, async (req, res) => {
  const { firNumber } = req.params;

  try {
    const deletedFIR = await FIR.findOneAndDelete({ firNumber });

    if (!deletedFIR) {
      return res.status(404).json({ message: "FIR not found" });
    }

    res.json({ message: "FIR deleted successfully" });
  } catch (error) {
    console.error("Error deleting FIR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
