const express = require("express");
const router = express.Router();
const { protect, adminOnly, adminOrSuperuser } = require("../middleware/auth");
const {
  getAllStructuralUnits,
  getStructuralUnitById,
  createStructuralUnit,
  updateStructuralUnit,
  deleteStructuralUnit,
  initializeDefaultUnits,
} = require("../controllers/structuralUnits");

// All routes are protected
router.use(protect);

// Routes accessible by admin and superuser
router.get("/", getAllStructuralUnits);
router.get("/:id", getStructuralUnitById);
router.post("/", adminOrSuperuser, createStructuralUnit);
router.put("/:id", adminOrSuperuser, updateStructuralUnit);

// Routes accessible only by admin
router.delete("/:id", adminOnly, deleteStructuralUnit);
router.post("/initialize", adminOnly, initializeDefaultUnits);

module.exports = router;
