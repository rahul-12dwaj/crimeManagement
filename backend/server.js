const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes"); 
const firRoutes = require("./routes/firRoutes");
const crimeRoutes = require("./routes/crimeRoutes");
const notificationRoutes = require("./routes/notificationRoutes")

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB Connection Error:", err));

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/fir", firRoutes);
app.use("/api/crimes", crimeRoutes);
app.use("/api/notification", notificationRoutes)

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
