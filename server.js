import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./ConnectDB/mongodb.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();
connectDB();

const app = express();

console.log("API Key:", process.env.CLOUDINARY_API_KEY);

/* ================= MIDDLEWARES ================= */

// ✅ CORS (allow cookies)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL (Postman doesn't need this)
    credentials: true,               // IMPORTANT for cookies
  })
);

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Parse cookies
app.use(cookieParser());

/* ================= ROUTES ================= */

// Authorization Routes
app.use("/api/auth", authRoutes);

app.use("/api/movies", movieRoutes);

/* ================= SERVER ================= */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const rooms = {}; // in-memory store (later move to Redis)

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, user }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        isPlaying: false,
        currentTime: 0,
      };
    }

    socket.emit("sync-state", rooms[roomId]);
  });

  socket.on("play", ({ roomId, time }) => {
    rooms[roomId] = { isPlaying: true, currentTime: time };
    socket.to(roomId).emit("play", time);
  });

  socket.on("pause", ({ roomId, time }) => {
    rooms[roomId] = { isPlaying: false, currentTime: time };
    socket.to(roomId).emit("pause", time);
  });

  socket.on("seek", ({ roomId, time }) => {
    rooms[roomId].currentTime = time;
    socket.to(roomId).emit("seek", time);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
