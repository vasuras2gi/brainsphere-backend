// const Resource = require("../models/Resource");
import Resource from "../models/Resource.js";
// const multer = require("multer");
import multer from "multer";
// const fs = require("fs");
import fs from "fs";

/* ---------- Ensure Upload Folder Exists ---------- */
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ---------- Multer Setup ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  }
});

/* ---------- File Filter ---------- */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "video/mp4",
    "application/pdf"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only MP4 videos or PDF files allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});


/* ---------- CREATE RESOURCE ---------- */
export const createResource = async (req, res) => {
  try {
    const { title, description, type, url, isPublic } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: "Title and type required" });
    }

    /* ---------- VALIDATION ---------- */

    // Video or PDF file required
    if ((type === "video" || type === "pdf-file") && !req.file) {
      return res.status(400).json({
        message: "File is required for this type"
      });
    }

    // URL required for link types
    if (
      (type === "youtube" ||
        type === "playlist" ||
        type === "pdf-link") &&
      !url
    ) {
      return res.status(400).json({
        message: "URL is required for this type"
      });
    }

    const resource = await Resource.create({
      title,
      description,
      type,
      url:
        type === "youtube" ||
        type === "playlist" ||
        type === "pdf-link"
          ? url
          : null,
      file:
        type === "video" || type === "pdf-file"
          ? req.file.path
          : null,
      isPublic: isPublic === "true" || isPublic === true,
      uploadedBy: req.user._id,
      downloads: 0
    });

    res.status(201).json(resource);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ---------- GET PUBLIC RESOURCES ---------- */
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ isPublic: true })
      .populate("uploadedBy", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ---------- INCREMENT DOWNLOAD ---------- */
export const incrementDownload = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ downloads: resource.downloads });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ---------- GET USER RESOURCES ---------- */
export const getUserResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      uploadedBy: req.params.userId
    })
      .populate("uploadedBy", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(resources);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
