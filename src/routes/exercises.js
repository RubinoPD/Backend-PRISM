const express = require("express");
const router = express.Router();
const { protect, adminOnly, adminOrSuperuser } = require("../middleware/auth");
const {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseStats,
} = require("../controllers/exercises");

// All routes are protected
router.use(protect);

// Routes accessible by admin and superuser
router.get("/", getAllExercises);
router.get("/stats", getExerciseStats);
router.get("/:id", getExerciseById);
router.post("/", adminOrSuperuser, createExercise);
router.put("/:id", adminOrSuperuser, updateExercise);

// Routes accessible only by admin
router.delete("/:id", adminOnly, deleteExercise);

module.exports = router;
