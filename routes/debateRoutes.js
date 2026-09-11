// const express = require("express");
import express from "express";
const router = express.Router();

// const {
//   createDebate,
//   getDebates,
//   getSingleDebate,  // ✅ make sure imported
//   addComment,
//   scoreDebateController,
//   getTopDebates,
//   voteDebate,
//   generateSummary
// } = require("../controllers/debateController");

import {  createDebate,
  getDebates,
  getSingleDebate,  // ✅ make sure imported
  addComment,
  scoreDebateController,
  getTopDebates,
  voteDebate,
  generateSummary} from "../controllers/debateController.js";

// const { protect } = require("../middleware/authMiddleware");
import { protect } from "../middleware/authMiddleware.js";

// Routes
router.post("/", protect, createDebate);
router.get("/", getDebates);
router.get("/top", getTopDebates);
router.get("/:id", getSingleDebate);  // ✅ must point to a function
router.post("/:id/comment", protect, addComment);
router.post("/:id/summary", protect, generateSummary);
router.post("/:id/score", protect, scoreDebateController);
router.post("/:id/vote", protect, voteDebate);

// module.exports = router;
export default router;
