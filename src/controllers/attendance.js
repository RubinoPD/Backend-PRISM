const Attendance = require("../models/attendance");
const Soldier = require("../models/soldier");

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
exports.getAllAttendance = async (req, res) => {
  try {
    // Filter options
    const filter = {};

    // Filter by unit if specified
    if (req.query.unit) {
      filter.unit = req.query.unit;
    }

    // Filter by status if specified
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by soldier if specified
    if (req.query.soldier) {
      filter.soldier = req.query.soldier;
    }

    // Date range filtering
    if (req.query.date) {
      // Extract single date and set beginning and end of day
      const targetDate = new Date(req.query.date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    } else if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    } else if (req.query.startDate) {
      filter.date = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.date = { $lte: new Date(req.query.endDate) };
    }

    const attendance = await Attendance.find(filter)
      .sort({ date: -1 })
      .populate("soldier", "firstName lastName militaryRank")
      .populate("createdBy", "username");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance for a specific date
// @route   GET /api/attendance/date/:date
// @access  Private
exports.getAttendanceByDate = async (req, res) => {
  try {
    const dateStr = req.params.date;
    const targetDate = new Date(dateStr);

    // Check if date is valid
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Get beginning and end of the day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Filter by unit if specified
    const filter = {
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    if (req.query.unit) {
      filter.unit = req.query.unit;
    }

    const attendance = await Attendance.find(filter)
      .populate(
        "soldier",
        "firstName lastName militaryRank primaryUnit subUnit"
      )
      .populate("createdBy", "username");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new attendance record
// @route   POST /api/attendance
// @access  Private (Admin/Superuser)
exports.createAttendance = async (req, res) => {
  try {
    const { date, soldier, status, reason, unit } = req.body;

    // Verify soldier exists
    const soldierExists = await Soldier.findById(soldier);
    if (!soldierExists) {
      return res.status(404).json({ message: "Soldier not found" });
    }

    // Check if attendance record already exists for this date and soldier
    const existingAttendance = await Attendance.findOne({
      date: new Date(date),
      soldier,
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance record already exists for this date and soldier",
      });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      date,
      soldier,
      status,
      reason,
      unit,
      createdBy: req.user._id,
    });

    // Populate response with related data
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate("soldier", "firstName lastName militaryRank")
      .populate("createdBy", "username");

    res.status(201).json(populatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create or update multiple attendance records
// @route   POST /api/attendance/bulk
// @access  Private (Admin/Superuser)
exports.bulkCreateAttendance = async (req, res) => {
  try {
    const { date, records, unit } = req.body;

    if (!date || !Array.isArray(records) || records.length === 0 || !unit) {
      return res.status(400).json({
        message: "Date, unit, and an array of records are required",
      });
    }

    const targetDate = new Date(date);
    const results = { created: 0, updated: 0, errors: [] };
    const operations = [];

    // Process each record
    for (const record of records) {
      try {
        // Verify soldier exists
        const soldierExists = await Soldier.findById(record.soldier);
        if (!soldierExists) {
          results.errors.push({
            soldier: record.soldier,
            message: "Soldier not found",
          });
          continue;
        }

        // Create or update attendance with upsert
        operations.push({
          updateOne: {
            filter: { date: targetDate, soldier: record.soldier },
            update: {
              $set: {
                status: record.status,
                reason: record.reason || "",
                unit,
                createdBy: req.user._id,
              },
            },
            upsert: true,
          },
        });
      } catch (error) {
        results.errors.push({
          soldier: record.soldier,
          message: error.message,
        });
      }
    }

    // Execute bulk operation if there are valid operations
    if (operations.length > 0) {
      const bulkResult = await Attendance.bulkWrite(operations);
      results.created = bulkResult.upsertedCount;
      results.updated = bulkResult.modifiedCount;
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private (Admin/Superuser)
exports.updateAttendance = async (req, res) => {
  try {
    const { status, reason } = req.body;

    // Find attendance record
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Update fields
    if (status) attendance.status = status;
    if (reason !== undefined) attendance.reason = reason;

    const updatedAttendance = await attendance.save();

    // Populate response with related data
    const populatedAttendance = await Attendance.findById(updatedAttendance._id)
      .populate("soldier", "firstName lastName militaryRank")
      .populate("createdBy", "username");

    res.json(populatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Admin only)
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    await attendance.deleteOne();
    res.json({ message: "Attendance record removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
// @access  Private
exports.getAttendanceStats = async (req, res) => {
  try {
    // Filter options
    const filter = {};

    // Filter by unit if specified
    if (req.query.unit) {
      filter.unit = req.query.unit;
    }

    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // Group by status and count
    const statusStats = await Attendance.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Convert to more user-friendly format
    const statusCounts = {};
    let totalRecords = 0;

    statusStats.forEach((stat) => {
      statusCounts[stat._id] = stat.count;
      totalRecords += stat.count;
    });

    // Calculate percentages
    const statusPercentages = {};
    Object.keys(statusCounts).forEach((status) => {
      statusPercentages[status] = (statusCounts[status] / totalRecords) * 100;
    });

    // Get time series data for trends (daily counts)
    const timeSeriesData = [];

    // Only do time series if date range is provided
    if (req.query.startDate && req.query.endDate) {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);

      // Group by date and status
      const dailyStats = await Attendance.aggregate([
        {
          $match: {
            ...filter,
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]);

      // Process the data for the chart
      const dateMap = {};

      dailyStats.forEach((stat) => {
        const dateStr = stat._id.date;
        const status = stat._id.status;
        const count = stat.count;

        if (!dateMap[dateStr]) {
          dateMap[dateStr] = {
            date: dateStr,
            Present: 0,
            Absent: 0,
            Sick: 0,
            Leave: 0,
            Mission: 0,
            Other: 0,
          };
        }

        dateMap[dateStr][status] = count;
      });

      // Convert to array for the response
      Object.values(dateMap).forEach((dateData) => {
        timeSeriesData.push(dateData);
      });
    }

    res.json({
      statusCounts,
      statusPercentages,
      totalRecords,
      timeSeriesData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
