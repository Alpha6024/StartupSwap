const express = require("express");
const cors    = require("cors");
const path    = require("path");
require("dotenv").config();

const authRoutes  = require("./routes/auth.routes");
const userRoutes  = require("./routes/user.routes");
const swipeRoutes = require("./routes/swipe.routes");

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (resumes, avatars)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth",  authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/swipe", swipeRoutes);

// Health check
app.get("/", (req, res) =>
  res.json({ message: "StartupSwipe API is running 🚀" })
);

// 404
app.use((req, res) =>
  res.status(404).json({ message: "Route not found" })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

module.exports = app;