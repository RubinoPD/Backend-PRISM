const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const soldiersRoutes = require("./routes/soldiers");
const structuralUnitsRoutes = require("./routes/structuralUnits");
const tasksRoutes = require("./routes/tasks");
const exercisesRoutes = require("./routes/exercises");
const evaluationsRoutes = require("./routes/evaluation");
const attendanceRoutes = require("./routes/attendance");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/soldiers", soldiersRoutes);
app.use("/api/structural-units", structuralUnitsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/exercises", exercisesRoutes);
app.use("/api/evaluations", evaluationsRoutes);
app.use("/api/attendance", attendanceRoutes);

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the PRISM API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occured",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // for testing purposes
