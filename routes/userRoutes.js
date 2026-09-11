// const express = require("express");
import express from "express";

const router = express.Router();
// const { getUserProfile } = require("../controllers/userController");
import {getUserProfile} from "../controllers/userController.js";
// const { updateUserProfile } = require("../controllers/userController");
import {updateUserProfile} from "../controllers/userController.js";
// const { protect } = require("../middleware/authMiddleware");
import {protect} from "../middleware/authMiddleware.js";

router.get("/profile/:id", getUserProfile);
router.put("/profile", protect, updateUserProfile);

// module.exports = router;
export default router;
