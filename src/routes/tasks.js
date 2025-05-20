const express = require("express");
const router = express.Router();
const { protect, adminOnly, adminOrSuperuser } = require("../middleware/auth");
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks");

// All routes are protected
router.use(protect);

// Routes accessible by admin and superuser
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", adminOrSuperuser, createTask);
router.put("/:id", adminOrSuperuser, updateTask);

// Routes accessible only by admin
router.delete("/:id", adminOnly, deleteTask);

module.exports = router;
