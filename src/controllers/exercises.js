const Exercise = require('../models/exercise');
const Task = require('../models/task');
const Soldier = require('../models/soldier');

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Private
exports.getAllExercises = async (req, res) => {
  try {
    // Filter by unit if specified
    const filter = {};

    if (req.query.unit) {
      filter.unit = req.query.unit;
    }

    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      // Set end date to end of day (23:59:59.999)
      endDate.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (req.query.startDate) {
      filter.date = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999);
      filter.date = { $lte: endDate };
    }

    const exercises = await Exercise.find(filter)
      .sort({ date: -1 })
      .populate('taskId', 'name')
      .populate('instructor', 'firstName lastName militaryRank')
      .populate('participants.soldier', 'firstName lastName militaryRank')
      .populate('createdBy', 'username');

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get exercise by ID
// @route   GET /api/exercises/:id
// @access  Private
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id)
      .populate('taskId', 'name')
      .populate('instructor', 'firstName lastName militaryRank')
      .populate('participants.soldier', 'firstName lastName militaryRank')
      .populate('createdBy', 'username');

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new exercise
// @route   POST /api/exercises
// @access  Private (Admin/Superuser)
exports.createExercise = async (req, res) => {
  try {
    const { taskId, date, duration, stage, instructor, participants, unit } =
      req.body;

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify instructor exists
    const instructorExists = await Soldier.findById(instructor);
    if (!instructorExists) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Verify all participants exist
    if (participants && participants.length > 0) {
      for (const participant of participants) {
        const soldierExists = await Soldier.findById(participant.soldier);
        if (!soldierExists) {
          return res.status(404).json({
            message: `Soldier with ID ${participant.soldier} not found`,
          });
        }
      }
    }

    const exercise = await Exercise.create({
      taskId,
      date,
      duration,
      stage,
      instructor,
      participants: participants || [],
      unit,
      createdBy: req.user._id,
    });

    // Populate response with related data
    const populatedExercise = await Exercise.findById(exercise._id)
      .populate('taskId', 'name')
      .populate('instructor', 'firstName lastName militaryRank')
      .populate('participants.soldier', 'firstName lastName militaryRank')
      .populate('createdBy', 'username');

    res.status(201).json(populatedExercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update exercise
// @route   PUT /api/exercises/:id
// @access  Private (Admin/Superuser)
exports.updateExercise = async (req, res) => {
  try {
    const { taskId, date, duration, stage, instructor, participants, unit } =
      req.body;

    // Find exercise
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Verify task exists if changing
    if (taskId && taskId !== exercise.taskId.toString()) {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      exercise.taskId = taskId;
    }

    // Verify instructor exists if changing
    if (instructor && instructor !== exercise.instructor.toString()) {
      const instructorExists = await Soldier.findById(instructor);
      if (!instructorExists) {
        return res.status(404).json({ message: 'Instructor not found' });
      }
      exercise.instructor = instructor;
    }

    // Verify all participants exist if changing
    if (participants) {
      for (const participant of participants) {
        const soldierExists = await Soldier.findById(participant.soldier);
        if (!soldierExists) {
          return res.status(404).json({
            message: `Soldier with ID ${participant.soldier} not found`,
          });
        }
      }
      exercise.participants = participants;
    }

    // Update other fields
    if (date) exercise.date = date;
    if (duration) exercise.duration = duration;
    if (stage) exercise.stage = stage;
    if (unit) exercise.unit = unit;

    const updatedExercise = await exercise.save();

    // Populate response with related data
    const populatedExercise = await Exercise.findById(updatedExercise._id)
      .populate('taskId', 'name')
      .populate('instructor', 'firstName lastName militaryRank')
      .populate('participants.soldier', 'firstName lastName militaryRank')
      .populate('createdBy', 'username');

    res.json(populatedExercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete exercise
// @route   DELETE /api/exercises/:id
// @access  Private (Admin only)
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    await exercise.deleteOne();
    res.json({ message: 'Exercise removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get exercise attendance statistics
// @route   GET /api/exercises/stats
// @access  Private
exports.getExerciseStats = async (req, res) => {
  try {
    // Filter by unit if specified
    const filter = {};

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

    const exercises = await Exercise.find(filter)
      .populate('taskId', 'name')
      .lean();

    // Calculate statistics
    const stats = {
      totalExercises: exercises.length,
      totalParticipants: 0,
      attendanceRate: 0,
      exercisesByTask: {},
      exercisesByStage: {
        IS: 0,
        IT: 0,
        II: 0,
        '-': 0,
      },
    };

    // Process exercises
    exercises.forEach((exercise) => {
      // Count by task
      const taskName = exercise.taskId ? exercise.taskId.name : 'Unknown';
      if (!stats.exercisesByTask[taskName]) {
        stats.exercisesByTask[taskName] = {
          count: 0,
          participants: 0,
          attended: 0,
        };
      }

      stats.exercisesByTask[taskName].count++;

      // Count by stage
      stats.exercisesByStage[exercise.stage]++;

      // Count participants and attendance
      if (exercise.participants && exercise.participants.length > 0) {
        stats.totalParticipants += exercise.participants.length;
        stats.exercisesByTask[taskName].participants +=
          exercise.participants.length;

        const attended = exercise.participants.filter((p) => p.attended).length;
        stats.exercisesByTask[taskName].attended += attended;
      }
    });

    // Calculate attendance rate
    if (stats.totalParticipants > 0) {
      let totalAttended = 0;

      Object.keys(stats.exercisesByTask).forEach((task) => {
        totalAttended += stats.exercisesByTask[task].attended;

        // Calculate rate for each task
        const taskStats = stats.exercisesByTask[task];
        taskStats.attendanceRate =
          taskStats.participants > 0
            ? (taskStats.attended / taskStats.participants) * 100
            : 0;
      });

      stats.attendanceRate = (totalAttended / stats.totalParticipants) * 100;
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
