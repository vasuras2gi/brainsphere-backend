// const express = require("express");
import express from "express";
const router = express.Router();
// const { registerUser, loginUser } = require("../controllers/authController");
import { registerUser, loginUser } from "../controllers/authController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);

// module.exports = router;
export default router;
