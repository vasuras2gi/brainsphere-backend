import express from "express";
import { protect } from "../middleware/authMiddleware.js"; 
import {
  createResource,
  getResources,
  incrementDownload,
  getUserResources,
  upload
} from "../controllers/resourceController.js"; 

// 1. We removed the whiteboardRoutes import entirely.

// 2. Uncomment this so this file has its own independent router instance:
const router = express.Router();

router.post("/", protect, upload.single("file"), createResource);
router.get("/", getResources);
router.post("/:id/download", incrementDownload);
router.get("/user/:userId", getUserResources);

export default router;