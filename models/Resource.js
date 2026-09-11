// const mongoose = require("mongoose");
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    type: {
      type: String,
      enum: [
        "youtube",
        "playlist",
        "pdf-link",
        "pdf-file",
        "video"
      ],
      required: true
    },

    url: String,     // youtube / playlist / pdf-link
    file: String,    // pdf-file / video

    topicTag: String,

    isPublic: {
      type: Boolean,
      default: true
    },

    downloads: {
      type: Number,
      default: 0
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Resource", resourceSchema);
export default mongoose.model("Resource", resourceSchema);
