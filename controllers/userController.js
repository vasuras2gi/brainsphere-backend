// const User = require("../models/User");
import User from "../models/User.js";
// const Debate = require("../models/Debate");
import Debate from "../models/Debate.js"
// const Resource = require("../models/Resource");
import Resource from "../models/Resource.js";
// const Post = require("../models/Post");
import Post from "../models/Post.js";

// export const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const debates = await Debate.find({ createdBy: req.params.id });

//     const resources = await Resource.find({ uploadedBy: req.params.id });

//     res.json({ user, debates, resources });

//   } catch (error) {
//     console.error("PROFILE ERROR:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };


export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.profilePic = req.body.profilePic || user.profilePic;

    const updatedUser = await user.save();

    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    const debates = await Debate.find({ createdBy: req.params.id });
    const resources = await Resource.find({ uploadedBy: req.params.id });

    const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 });

    res.json({
      user,
      debates,
      resources,
      posts   // 🔥 NEW
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};