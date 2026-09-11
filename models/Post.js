// const mongoose = require("mongoose");
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["image", "short"],
      required: true
    },
    media: {
      type: String, // image path or video path
      required: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Post", postSchema);
export default mongoose.model("Post", postSchema);
