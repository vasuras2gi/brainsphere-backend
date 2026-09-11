// const express = require("express");
import express from "express";
const router = express.Router();
// const postController = require("../controllers/postController.js");
import postController from "../controllers/postController.js";
// const { protect } = require("../middleware/authMiddleware.js");
import {protect} from "../middleware/authMiddleware.js";

router.post(
  "/",
  protect,
  postController.upload.single("media"),
  postController.createPost
);

router.get("/", postController.getFeed);

router.post("/:id/like", protect, postController.likePost);

// module.exports = router;
export default router;
