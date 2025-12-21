import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./ConnectDB/mongodb.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
connectDB();

const app = express();

/* ================= MIDDLEWARES ================= */

// ✅ CORS (allow cookies)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL (Postman doesn't need this)
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

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
