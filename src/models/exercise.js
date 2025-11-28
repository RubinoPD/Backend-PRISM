const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
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
    enum: ['IS', 'IT', 'II', '-'],
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Soldier',
    required: true,
  },
  participants: [
    {
      soldier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Soldier',
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
    required: false,
    // Remove enum validation to allow empty string
    validate: {
      validator: function (v) {
        // If value exists, it must be one of the valid units
        if (v && v.length > 0) {
          return [
            'Paramos burys',
            'Rysiu ir informaciniu sistemu burys',
            'Valdymo grupe',
          ].includes(v);
        }
        // Allow empty/null values
        return true;
      },
      message: (props) => `${props.value} is not a valid unit`,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better query performance

exerciseSchema.index({ date: 1 }); // for date range queries
exerciseSchema.index({ unit: 1 }); // for unit filtering
exerciseSchema.index({ taskId: 1 }); // for task statistics

module.exports = mongoose.model('Exercise', exerciseSchema);
