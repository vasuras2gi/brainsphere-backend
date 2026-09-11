// const mongoose = require("mongoose");
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  profilePic: { type: String, default: "" }, // ✅ ADD THIS

  bio: { type: String, default: "" },
  skills: [String],
  interests: [String],
  xp: { type: Number, default: 0 },
  badges: [String]

}, { timestamps: true });


// module.exports = mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema);

