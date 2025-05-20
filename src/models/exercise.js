const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // Hours
    required: true,
  },
  stage: {
    type: String,
    enum: ["IS", "IT", "II", "-"],
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Soldier",
    required: true,
  },
  participants: [
    {
      soldier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Soldier",
        required: true,
      },
      attended: {
        type: Boolean,
        default: false,
      },
    },
  ],
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

module.exports = mongoose.model("Exercise", exerciseSchema);
