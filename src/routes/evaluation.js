const express = require("express");
const router = express.Router();
const { protect, adminOnly, adminOrSuperuser } = require("../middleware/auth");
const {
  getAllEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationStats,
} = require("../controllers/evaluations");

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.get("/", getAllEvaluations);
router.get("/stats", getEvaluationStats);
router.get("/:id", getEvaluationById);

// Routes accessible by admin and superuser
router.post("/", adminOrSuperuser, createEvaluation);
router.put("/:id", adminOrSuperuser, updateEvaluation);

// Routes accessible only by admin
router.delete("/:id", adminOnly, deleteEvaluation);

module.exports = router;
