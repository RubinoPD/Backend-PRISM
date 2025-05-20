const StructuralUnit = require("../models/structuralUnit");

// @desc    Get all structural units
// @route   GET /api/structural-units
// @access  Private
exports.getAllStructuralUnits = async (req, res) => {
  try {
    // Filter by parentUnit if specified
    const filter = {};

    if (req.query.parentUnit) {
      filter.parentUnit = req.query.parentUnit;
    }

    // Filter by active status
    if (req.query.active !== undefined) {
      filter.active = req.query.active === "true";
    }

    const units = await StructuralUnit.find(filter).sort({ name: 1 });
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get structural unit by ID
// @route   GET /api/structural-units/:id
// @access  Private
exports.getStructuralUnitById = async (req, res) => {
  try {
    const unit = await StructuralUnit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({ message: "Structural unit not found" });
    }

    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new structural unit
// @route   POST /api/structural-units
// @access  Private (Admin/Superuser)
exports.createStructuralUnit = async (req, res) => {
  try {
    const { name, parentUnit, active } = req.body;

    // Check if unit with same name already exists
    const existingUnit = await StructuralUnit.findOne({ name });
    if (existingUnit) {
      return res
        .status(400)
        .json({ message: "A structural unit with this name already exists" });
    }

    const unit = await StructuralUnit.create({
      name,
      parentUnit,
      active: active !== undefined ? active : true,
    });

    res.status(201).json(unit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update structural unit
// @route   PUT /api/structural-units/:id
// @access  Private (Admin/Superuser)
exports.updateStructuralUnit = async (req, res) => {
  try {
    const { name, parentUnit, active } = req.body;

    // Find unit
    const unit = await StructuralUnit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({ message: "Structural unit not found" });
    }

    // If name is changing, check for duplicates
    if (name && name !== unit.name) {
      const existingUnit = await StructuralUnit.findOne({ name });
      if (existingUnit) {
        return res
          .status(400)
          .json({ message: "A structural unit with this name already exists" });
      }
    }

    // Update fields
    unit.name = name || unit.name;
    unit.parentUnit = parentUnit || unit.parentUnit;

    if (active !== undefined) {
      unit.active = active;
    }

    const updatedUnit = await unit.save();
    res.json(updatedUnit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete structural unit
// @route   DELETE /api/structural-units/:id
// @access  Private (Admin only)
exports.deleteStructuralUnit = async (req, res) => {
  try {
    const unit = await StructuralUnit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({ message: "Structural unit not found" });
    }

    await unit.deleteOne();
    res.json({ message: "Structural unit removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Initialize default structural units for "Rysiu ir informaciniu sistemu burys"
// @route   POST /api/structural-units/initialize
// @access  Private (Admin only)
exports.initializeDefaultUnits = async (req, res) => {
  try {
    const defaultUnits = [
      { name: "RIS burys", parentUnit: "Rysiu ir informaciniu sistemu burys" },
      {
        name: "LAN/WAN skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "Videotelekonferencijos skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "Laidinio rysio skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "Kompiuteriniui tinklu skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "1 rysiu skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "2 rysiu skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
      {
        name: "Vartotoju aptarnavimo skyrius",
        parentUnit: "Rysiu ir informaciniu sistemu burys",
      },
    ];

    // Check if units already exist
    const existingUnits = await StructuralUnit.find({
      parentUnit: "Rysiu ir informaciniu sistemu burys",
    });

    if (existingUnits.length > 0) {
      return res.status(400).json({
        message: "Default units already exist",
        existingUnits,
      });
    }

    // Create all units
    const createdUnits = await StructuralUnit.insertMany(defaultUnits);

    res.status(201).json({
      message: "Default structural units initialized successfully",
      units: createdUnits,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
