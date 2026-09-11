// const mongoose = require("mongoose");
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    debate: { type: mongoose.Schema.Types.ObjectId, ref: "Debate", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Comment", commentSchema);
export default mongoose.model("Comment", commentSchema);
