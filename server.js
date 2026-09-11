import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
// const { Server } = require("socket.io");
import { Server } from "socket.io";


// Routes
// const authRoutes = require("./routes/authRoutes");
import authRoutes from "./routes/authRoutes.js";

// const debateRoutes = require("./routes/debateRoutes");
import debateRoutes from "./routes/debateRoutes.js";

// const whiteboardRoutes = require("./routes/whiteboardRoutes");
import whiteboardRoutes from "./routes/whiteboardRoutes.js";

// const resourceRoutes = require("./routes/resourceRoute");
import resourceRoutes from "./routes/resourceRoute.js";

// const commentRoutes = require("./routes/commentRoutes");
import commentRoutes from "./routes/commentRoutes.js";

import userRoutes from "./routes/userRoutes.js";
import router from "./routes/postRoutes.js";

import dns from 'node:dns';


dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to req in middleware (for controller usage)
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/debates", debateRoutes);
app.use("/api/whiteboards", whiteboardRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/posts", router);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

app.get("/", (req, res) => res.send("BrainSphere API Running..."));

// ============================
// 🔥 SOCKET.IO LOGIC
// ============================
// const Comment = require("./models/Comment"); // require once, outside
import Comment from "./models/Comment.js";

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Join debate room
  socket.on("joinDebate", (debateId) => {
    socket.join(debateId);
    console.log(`User joined debate: ${debateId}`);
  });

  // Send comment
  socket.on("sendComment", async ({ debateId, text, userId }) => {
    try {
      if (!debateId || !text || !userId) return;

      const newComment = await Comment.create({ debate: debateId, user: userId, text });

      // Populate user for frontend display
      const populatedComment = await newComment.populate("user", "name profilePic");

      // Emit to all users in room
      io.to(debateId).emit("receiveComment", populatedComment);

    } catch (err) {
      console.error("Socket sendComment error:", err.message);
    }
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
