import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http"; // 1. REQUIRED: Node's native HTTP server
import { Server } from "socket.io";  // 2. REQUIRED: Socket.io library

import connectDB from "./ConnectDB/mongodb.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import watchProgressRoutes from "./routes/watchProgress.route.js";
import roomIdRoutes from "./routes/roomId.route.js";

dotenv.config();
connectDB();

const app = express();

/* ==========================================================================
   SERVER INITIALIZATION
   We must wrap the Express 'app' with 'createServer' so Socket.io can attach to it.
   ========================================================================== */
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your Frontend URL (React/Vite)
    methods: ["GET", "POST"],
    credentials: true                // Allow cookies/headers
  }
});

console.log("API Key:", process.env.CLOUDINARY_API_KEY);

/* ================= MIDDLEWARES ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* ================= REST API ROUTES ================= */
// These handle your standard Login, Movie Uploads, and Progress saving
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/progress", watchProgressRoutes);
app.use("/api/room", roomIdRoutes);

/* ==========================================================================
   ⚡ SOCKET.IO - REAL-TIME WATCH PARTY BACKEND ⚡
   This section handles all the logic for syncing users together.
   ========================================================================== */
io.on("connection", (socket) => {
  console.log(`🟢 User Connected: ${socket.id}`);

  // 1. JOIN ROOM
  // Triggered when a user enters a Watch Party URL
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`👥 User ${socket.id} joined room: ${roomId}`);
    
    // Notify others in the room (optional, good for showing "User joined" toasts)
    socket.to(roomId).emit("user_joined", { id: socket.id });
  });

  // 2. VIDEO SYNC ACTIONS (Play, Pause, Seek)
  // Triggered when the Host clicks controls on the video player
  socket.on("video_action", (data) => {
    const { roomId, type, timestamp } = data;
    
    // Debug log to monitor actions in console
    console.log(`🎬 Action: ${type} | Room: ${roomId} | Time: ${timestamp}`);

    // 🚨 BROADCAST TO OTHERS ONLY
    // We use 'socket.to()' instead of 'io.to()' so the sender doesn't receive their own message.
    // Receiving your own 'pause' message would cause a loop.
    socket.to(roomId).emit("receive_video_action", { 
        type, 
        timestamp 
    });
  });

  // 3. LIVE CHAT
  // Triggered when a user types a message
  socket.on("send_message", (data) => {
    const { roomId, message, user } = data;

    // BROADCAST TO EVERYONE (Including Sender)
    // For chat, the sender wants to see their message appear immediately.
    io.to(roomId).emit("receive_message", {
        user, 
        message,
        timestamp: new Date().toISOString()
    });
  });

  // 4. DISCONNECT
  socket.on("disconnect", () => {
    console.log(`🔴 User Disconnected: ${socket.id}`);
  });
});

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;

// ⚠️ CRITICAL: Must listen on 'httpServer', NOT 'app'
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});