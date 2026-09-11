// const Debate = require("../models/Debate");
import Debate from "../models/Debate.js";
// const Comment = require("../models/Comment");
import Comment from "../models/Comment.js";
// const { generateDebateSummary } = require("../services/aiServices");
import {generateDebateSummary} from "../services/aiServices.js";

// Create Debate
export const createDebate = async (req, res) => {
  try {
    const { title, description, topicTag } = req.body;

    const debate = await Debate.create({
      title,
      description,
      topicTag,
      createdBy: req.user._id,
    });

    res.status(201).json(debate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Debates
export const getDebates = async (req, res) => {
  try {
    const debates = await Debate.find()
      .populate("createdBy", "name profilePic")
      .sort({ createdAt: -1 });
    res.json(debates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Comment (Separate Model)
export const addComment = async (req, res) => {
  try {
    const debateId = req.params.id;
    const { text } = req.body;

    const debate = await Debate.findById(debateId);
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    const newComment = await Comment.create({
      debate: debateId,
      text,
      user: req.user._id
    });

    const populatedComment = await newComment.populate("user", "name profilePic");

    // Socket.IO emit (req.io attached in server.js middleware)
    if (req.io) {
      req.io.to(debateId).emit("receiveComment", populatedComment);
    }

    res.status(201).json(populatedComment);

  } catch (error) {
    console.error("COMMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// Generate AI Summary
export const generateSummary = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    // Fetch all comments text
    const comments = await Comment.find({ debate: debate._id });
    let fullText = `Title: ${debate.title}\nDescription: ${debate.description}\n`;
    comments.forEach(c => fullText += `Comment: ${c.text}\n`);

    if (!fullText.trim()) return res.status(400).json({ message: "Debate has no content." });

    const summary = await generateDebateSummary(fullText);

    debate.aiSummary = summary;
    await debate.save();

    res.json({ summary });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Vote Debate
export const voteDebate = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    const userId = req.user._id;
    const alreadyVoted = debate.votedBy.some(id => id.toString() === userId.toString());

    if (alreadyVoted) {
      debate.votedBy = debate.votedBy.filter(id => id.toString() !== userId.toString());
    } else {
      debate.votedBy.push(userId);
    }

    await debate.save();
    res.json(debate);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Debate + Comments
export const getSingleDebate = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id)
      .populate("createdBy", "name profilePic");

    if (!debate) return res.status(404).json({ message: "Debate not found" });

    const comments = await Comment.find({ debate: debate._id })
      .populate("user", "name profilePic")
      .sort({ createdAt: 1 });

    res.json({ ...debate.toObject(), comments });
  } catch (error) {
    console.error("GET SINGLE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get top debates
export const getTopDebates = async (req, res) => {
  try {
    const debates = await Debate.find()
      .populate("createdBy", "name profilePic")
      .sort({ votedBy: -1 }) // ya koi scoring metric
      .limit(10);

    res.json(debates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Score debate (example: like +1, dislike -1)
export const scoreDebateController = async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ message: "Debate not found" });

    const { score } = req.body; // assume score = +1 or -1
    debate.score = (debate.score || 0) + score;

    await debate.save();
    res.json(debate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
