const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  deleteUser,
} = require("../controllers/auth");

// Public routes
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getUserProfile);

// Admin only routes
router.post("/register", protect, adminOnly, registerUser);
router.get("/users", protect, adminOnly, getUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
