// const Post = require("../models/Post");
import Post from "../models/Post.js";
// const multer = require("multer");
import multer from "multer";

/* ---------- MULTER ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 },
});

/* ---------- CREATE POST ---------- */
export const createPost = async (req, res) => {
  try {
    const { caption, type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Media required" });
    }

    const post = await Post.create({
      caption,
      type,
      media: req.file.path,
      user: req.user._id
    });

    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------- GET FEED ---------- */
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------- LIKE POST ---------- */
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Not found" });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({ likes: post.likes.length });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {createPost, getFeed, likePost, upload};