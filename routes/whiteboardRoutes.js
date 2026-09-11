// const express = require("express");
import express from "express";
const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
import {protect} from "../middleware/authMiddleware.js";

import {
  createWhiteboard,
  getWhiteboards,
  updateWhiteboard
} from "../controllers/whiteboardController.js";

router.post("/", protect, createWhiteboard);
router.get("/", protect, getWhiteboards);
router.put("/:id", protect, updateWhiteboard);

// module.exports = router;
export default router;
