const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  soldier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Soldier",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Present", "Absent", "Sick", "Leave", "Mission", "Other"],
  },
  reason: {
    type: String,
    trim: true,
  },
  unit: {
    type: String,
    required: true,
    enum: [
      "Paramos burys",
      "Rysiu ir informaciniu sistemu burys",
      "Valdymo grupe",
    ],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index for date and soldier to ensure uniqueness
attendanceSchema.index({ date: 1, soldier: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
