// const router = require("express").Router();
// import  router from "express";
import express from "express";
const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
import {protect} from "../middleware/authMiddleware.js";
// const Comment = require("../models/Comment");
import Comment from "../models/Comment.js";
// const Debate = require("../models/Debate");
import Debate from "../models/Debate.js";

// -----------------------------------
// Get all comments for a debate
// GET /api/comments/:debateId
// -----------------------------------
router.get("/:debateId", async (req, res) => {
  try {
    const comments = await Comment.find({ debate: req.params.debateId })
      .populate("user", "name profilePic")
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.error("FETCH COMMENTS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// -----------------------------------
// Add comment
// POST /api/comments/:debateId
// -----------------------------------
router.post("/:debateId", protect, async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.debateId);
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    const { text } = req.body;
    if (!text || text.trim() === "")
      return res.status(400).json({ message: "Comment cannot be empty" });

    const newComment = await Comment.create({
      debate: req.params.debateId,
      text,
      user: req.user._id, // protect middleware se user mil raha hai
    });

    const populatedComment = await newComment.populate("user", "name profilePic");

    // Optional: Socket.IO emit if req.io exists
    if (req.io) {
      req.io.to(req.params.debateId).emit("receiveComment", populatedComment);
    }

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("ADD COMMENT ERROR:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// module.exports = router;
export default router;
