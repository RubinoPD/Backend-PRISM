const Soldier = require("../models/soldier");

// @desc    Get all soldiers
// @route   GET /api/soldiers
// @access  Private
exports.getAllSoldiers = async (req, res) => {
  try {
    // Filter by unit if specified
    const filter = {};

    if (req.query.primaryUnit) {
      filter.primaryUnit = req.query.primaryUnit;
    }

    if (req.query.subUnit) {
      filter.subUnit = req.query.subUnit;
    }

    const soldiers = await Soldier.find(filter).sort({
      lastName: 1,
      firstName: 1,
    });
    res.json(soldiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get soldier by ID
// @route   GET /api/soldiers/:id
// @access  Private
exports.getSoldierById = async (req, res) => {
  try {
    const soldier = await Soldier.findById(req.params.id);

    if (!soldier) {
      return res.status(404).json({ message: "Soldier not found" });
    }

    res.json(soldier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new soldier
// @route   POST /api/soldiers
// @access  Private (Admin/Superuser)
exports.createSoldier = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      militaryRank,
      joinDate,
      primaryUnit,
      subUnit,
    } = req.body;

    // Validate that subUnit is required for "Rysiu ir informaciniu sistemu burys"
    if (primaryUnit === "Rysiu ir informaciniu sistemu burys" && !subUnit) {
      return res.status(400).json({
        message: "Sub-unit is required for the selected primary unit",
      });
    }

    const soldier = await Soldier.create({
      firstName,
      lastName,
      militaryRank,
      joinDate,
      primaryUnit,
      subUnit,
    });

    res.status(201).json(soldier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update soldier
// @route   PUT /api/soldiers/:id
// @access  Private (Admin/Superuser)
exports.updateSoldier = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      militaryRank,
      joinDate,
      primaryUnit,
      subUnit,
      active,
    } = req.body;

    // Find soldier
    const soldier = await Soldier.findById(req.params.id);

    if (!soldier) {
      return res.status(404).json({ message: "Soldier not found" });
    }

    // Validate that subUnit is required for "Rysiu ir informaciniu sistemu burys"
    if (primaryUnit === "Rysiu ir informaciniu sistemu burys" && !subUnit) {
      return res.status(400).json({
        message: "Sub-unit is required for the selected primary unit",
      });
    }

    // Update fields
    soldier.firstName = firstName || soldier.firstName;
    soldier.lastName = lastName || soldier.lastName;
    soldier.militaryRank = militaryRank || soldier.militaryRank;
    soldier.joinDate = joinDate || soldier.joinDate;

    // Handle primaryUnit and subUnit updates
    if (primaryUnit !== undefined) {
      soldier.primaryUnit = primaryUnit;

      // If changing to "Rysiu ir informaciniu sistemu burys", subUnit should be provided
      if (primaryUnit === "Rysiu ir informaciniu sistemu burys") {
        if (subUnit !== undefined) {
          soldier.subUnit = subUnit;
        }
        // If no subUnit provided but switching to RIS unit, keep existing subUnit if it exists
      } else {
        // If changing away from "Rysiu ir informaciniu sistemu burys", clear subUnit
        soldier.subUnit = undefined;
      }
    } else if (subUnit !== undefined) {
      // If only updating subUnit (primaryUnit not changed)
      soldier.subUnit = subUnit;
    }

    if (active !== undefined) {
      soldier.active = active;
    }

    const updatedSoldier = await soldier.save();
    res.json(updatedSoldier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete soldier
// @route   DELETE /api/soldiers/:id
// @access  Private (Admin only)
exports.deleteSoldier = async (req, res) => {
  try {
    const soldier = await Soldier.findById(req.params.id);

    if (!soldier) {
      return res.status(404).json({ message: "Soldier not found" });
    }

    await soldier.deleteOne();
    res.json({ message: "Soldier removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
