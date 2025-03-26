const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aadhaar: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true},
  password: { type: String, required: true },
  resetOtp: { type: String, default: null },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("user", userSchema);
