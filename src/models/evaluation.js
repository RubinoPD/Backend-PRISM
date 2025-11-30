const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  evaluationType: {
    type: String,
    enum: ["Oficialus", "Neoficialus"],
    required: true,
  },
  taskCode: {
    type: String,
    required: true,
    trim: true,
  },
  taskName: {
    type: String,
    required: true,
    trim: true,
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Soldier",
    required: true,
  },
  ratings: [
    {
      soldier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Soldier",
        required: true,
      },
      rating: {
        type: String,
        enum: ["I", "IA", "NI", "-"],
        required: true,
      },
    },
  ],
  completionPercentage: {
    type: Number,
    default: 0, // Will be calculated based on ratings
  },
  totalPassed: {
    type: Number,
    default: 0,
  },
  dailyPassed: {
    type: Number,
    default: 0,
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

// Calculate completion percentage and pass counts before saving
evaluationSchema.pre("save", function (next) {
  if (this.ratings && this.ratings.length > 0) {
    let passedCount = 0;

    this.ratings.forEach((rating) => {
      // Count ratings that are "I" or "IA" as passed
      if (rating.rating === "I" || rating.rating === "IA") {
        passedCount++;
      }
    });

    // Calculate percentage
    this.completionPercentage = (passedCount / this.ratings.length) * 100;

    // Set total passed
    this.totalPassed = passedCount;

    // For daily passed, I'd need to track by date - for now, using the same value
    this.dailyPassed = passedCount;
  }
  next();
});

// Indexes for better query performance
evaluationSchema.index({ date: 1 }); // For date range queries
evaluationSchema.index({ evaluationType: 1 }); // For type filtering
evaluationSchema.index({ unit: 1 }); // For unit filtering

module.exports = mongoose.model("Evaluation", evaluationSchema);
