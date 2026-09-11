// const mongoose = require("mongoose");
import mongoose from "mongoose";

const debateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    topicTag: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    aiScore: {
      clarity: { type: Number, default: 0 },
      logic: { type: Number, default: 0 },
      argumentStrength: { type: Number, default: 0 },
      overallScore: { type: Number, default: 0 }
    },
    votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    aiSummary: { type: String, default: "" }
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Debate", debateSchema);
export default mongoose.model("Debate", debateSchema);

