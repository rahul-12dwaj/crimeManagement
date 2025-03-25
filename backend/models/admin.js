const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: { type: [String], default: ["manage_users", "view_reports"] },
  role: { type: String, default: "admin" },
  roleDesignation: { type: String, required: true }, // New field
  officerId: { type: String, required: true }, // New field
  department: { type: String, required: true }, // New field
  branch: { type: String, required: true }, // New field
}, { timestamps: true });


AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


module.exports = mongoose.model("Admin", AdminSchema);
