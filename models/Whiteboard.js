// const mongoose = require("mongoose");
import mongoose from "mongoose";

const whiteboardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    data: {
      type: Object,   // store full canvas JSON
      required: true
    },

    debate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Debate",
      default: null
    }

  },
  { timestamps: true }
);

// module.exports = mongoose.model("Whiteboard", whiteboardSchema);
export default mongoose.model("Whiteboard", whiteboardSchema);
