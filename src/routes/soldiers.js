const express = require("express");
const router = express.Router();
const { protect, adminOnly, adminOrSuperuser } = require("../middleware/auth");
const {
  getAllSoldiers,
  getSoldierById,
  createSoldier,
  updateSoldier,
  deleteSoldier,
} = require("../controllers/soldiers");

// All routes are protected
router.use(protect);

// Routes accessible by admin and superuser
router.get("/", getAllSoldiers);
router.get("/:id", getSoldierById);
router.post("/", adminOrSuperuser, createSoldier);
router.put("/:id", adminOrSuperuser, updateSoldier);

// Routes accessible only by admin
router.delete("/:id", adminOnly, deleteSoldier);

module.exports = router;
