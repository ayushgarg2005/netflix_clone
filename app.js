const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
    credentials: true, // IMPORTANT for cookies
  })
);

app.use("/api/auth", authRoutes);

module.exports = app;
