const express = require("express");
const router = express.Router();
const CrimeStats = require("../models/CrimeStats");

// ✅ Get all crime stats
router.get("/all-crimes", async (req, res) => {
  try {
    const stats = await CrimeStats.find();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update crime count or add new crime type
router.put("/:name", async (req, res) => {
  const { name } = req.params;
  const { count } = req.body;

  if (!Number.isInteger(count) || count < 0) {
    return res.status(400).json({ message: "Invalid count value" });
  }

  try {
    let crimeStat = await CrimeStats.findOne({ name });

    if (crimeStat) {
      // 🔹 Update existing crime record
      crimeStat.count = count;
      await crimeStat.save();
      return res.json({ message: `Updated ${name} count to ${count}`, crimeStat });
    } else {
      // 🔹 Create a new crime type if not found
      const newCrimeStat = new CrimeStats({ name, count });
      await newCrimeStat.save();
      return res.status(201).json({ message: `Added new crime type: ${name}`, newCrimeStat });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
