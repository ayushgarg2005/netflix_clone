import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http"; // 1. REQUIRED: Node's native HTTP server
import { Server } from "socket.io"; // 2. REQUIRED: Socket.io library

import connectDB from "./ConnectDB/mongodb.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import watchProgressRoutes from "./routes/watchProgress.route.js";
import roomIdRoutes from "./routes/roomId.route.js";
import Message from "./models/message.model.js";
import RoomId from "./models/RoomId.model.js";

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
    credentials: true, // Allow cookies/headers
  },
});

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
/* ⚡ SOCKET.IO - WATCH PARTY LOGIC ⚡ */
// Assuming you have your Message model imported
// const Message = require("./models/Message");

io.on("connection", (socket) => {
  // 1. JOIN ROOM
  socket.on("join_room", async ({ roomId, userId }) => {
    socket.join(roomId);

    await RoomId.findOneAndUpdate(
      { roomId },
      {
        $addToSet: {
          participants: {
            userId,
            socketId: socket.id,
          },
        },
      },
      { new: true }
    );

    // 👇 IMPORTANT: populate user details
    const room = await RoomId.findOne({ roomId }).populate(
      "participants.userId",
      "name email"
    );

    io.to(roomId).emit("participants_update", room.participants);

    /**
     * When a new user joins, we automatically ask the host for the current state
     * so the new user starts at the right time.
     */
    socket
      .to(roomId)
      .emit("request_sync_from_host", { requesterId: socket.id });
  });

  // 2. ADMIN VIDEO ACTIONS (Play, Pause, Seek)
  socket.on("video_action", (data) => {
    const { roomId, type, timestamp } = data;
    /**
     * We broadcast the admin's action to all other users in the room.
     * The frontend logic handles the 'isOutOfSync' check to see if the
     * guest should follow this command or ignore it.
     */
    socket.to(roomId).emit("receive_video_action", {
      type,
      timestamp,
      senderId: socket.id,
    });
  });

  // 3. MANUAL SYNC REQUEST (Triggered by Guest "Sync" button)
  socket.on("request_sync", ({ roomId }) => {
    /**
     * We broadcast this to the room.
     * Only the user who is 'isAdmin' in the frontend will respond to this event.
     */
    socket
      .to(roomId)
      .emit("request_sync_from_host", { requesterId: socket.id });
  });

  // 4. HOST SENDING STATE (Host response to Sync Request)
  socket.on("send_sync_state", (data) => {
    const { requesterId, timestamp, isPlaying } = data;
    /**
     * The host sends their current timeline and play status.
     * We send this specifically back to the guest who requested it.
     */
    io.to(requesterId).emit("receive_sync_state", {
      timestamp,
      isPlaying,
    });
  });

  // 5. CHAT MESSAGING
  socket.on("send_message", async (data) => {
    const { roomId, message, user } = data;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      // Save message to DB
      const newMessage = new Message({
        roomId,
        user,
        message,
        time,
      });
      await newMessage.save();

      // Broadcast message to everyone in the room (including sender)
      io.to(roomId).emit("receive_message", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // 6. DISCONNECT
  socket.on("disconnect", async () => {
    const room = await RoomId.findOneAndUpdate(
      { "participants.socketId": socket.id },
      { $pull: { participants: { socketId: socket.id } } },
      { new: true }
    ).populate("participants.userId", "name email");

    if (room) {
      io.to(room.roomId).emit("participants_update", room.participants);
    }
  });
});

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;

// ⚠️ CRITICAL: Must listen on 'httpServer', NOT 'app'
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
