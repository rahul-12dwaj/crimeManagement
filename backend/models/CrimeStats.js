const mongoose = require("mongoose");

const predefinedCrimes = [
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
];

const CrimeStatsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate crime names
    trim: true,
    enum: predefinedCrimes, // Restrict to predefined crimes
  },
  count: {
    type: Number,
    required: true,
    default: 0, // Default count is 0
    min: 0, // Prevent negative numbers
  },
});

// ✅ Auto-insert predefined crimes if not already in DB
const CrimeStats = mongoose.model("CrimeStats", CrimeStatsSchema);

async function initializeCrimeStats() {
  try {
    for (const crime of predefinedCrimes) {
      const existingCrime = await CrimeStats.findOne({ name: crime });
      if (!existingCrime) {
        await CrimeStats.create({ name: crime, count: 0 });
      }
    }
    console.log("✅ Predefined crimes initialized successfully.");
  } catch (error) {
    console.error("❌ Error initializing crime stats:", error);
  }
}

initializeCrimeStats(); // Run once when server starts

module.exports = CrimeStats;
