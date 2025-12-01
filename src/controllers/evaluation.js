const Evaluation = require('../models/evaluation');
const Soldier = require('../models/soldier');
const Task = require('../models/task');

// @desc    Get all evaluations
// @route   GET /api/evaluations
// @access  Private
exports.getAllEvaluations = async (req, res) => {
  try {
    // Filter options
    const filter = {};

    // Filter by unit if specified
    if (req.query.unit) {
      filter.unit = req.query.unit;
    }

    // Filter by evaluation type if specified
    if (req.query.evaluationType) {
      filter.evaluationType = req.query.evaluationType;
    }

    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    } else if (req.query.startDate) {
      filter.date = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.date = { $lte: new Date(req.query.endDate) };
    }

    // Get all evaluations with populated fields
    const evaluations = await Evaluation.find(filter)
      .sort({ date: -1 })
      .populate('taskId', 'name code')
      .populate('recordedBy', 'firstName lastName militaryRank')
      .populate(
        'ratings.soldier',
        'firstName lastName militaryRank primaryUnit'
      )
      .populate('createdBy', 'username');

    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get evaluation by ID
// @route   GET /api/evaluations/:id
// @access  Private
exports.getEvaluationById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate('taskId', 'name code')
      .populate('recordedBy', 'firstName lastName militaryRank')
      .populate(
        'ratings.soldier',
        'firstName lastName militaryRank primaryUnit'
      )
      .populate('history.recordedBy', 'firstName lastName militaryRank')
      .populate(
        'history.ratings.soldier',
        'firstName lastName militaryRank primaryUnit'
      )
      .populate('createdBy', 'username');

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new evaluation
// @route   POST /api/evaluations
// @access  Private (Admin/Superuser)
exports.createEvaluation = async (req, res) => {
  try {
    const {
      taskId,
      date,
      evaluationType,
      taskCode,
      taskName,
      recordedBy,
      ratings,
    } = req.body;

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if evaluation already exists for this task
    const existingEvaluation = await Evaluation.findOne({ taskId });
    if (existingEvaluation) {
      return res.status(400).json({
        message:
          'Evaluation for this task already exists. Please edit the existing evaluation instead.',
        existingEvaluationId: existingEvaluation._id,
      });
    }

    // Verify recorder exists
    const recorderExists = await Soldier.findById(recordedBy);
    if (!recorderExists) {
      return res.status(404).json({ message: 'Recorder not found' });
    }

    // Verify all rated soldiers exist
    if (ratings && ratings.length > 0) {
      for (const rating of ratings) {
        const soldierExists = await Soldier.findById(rating.soldier);
        if (!soldierExists) {
          return res.status(404).json({
            message: `Soldier with ID ${rating.soldier} not found`,
          });
        }
      }
    }

    // Create evaluation
    const evaluation = await Evaluation.create({
      taskId,
      date,
      evaluationType,
      taskCode,
      taskName,
      recordedBy,
      ratings: ratings || [],
      history: [],
      createdBy: req.user._id,
    });

    // Populate response with related data
    const populatedEvaluation = await Evaluation.findById(evaluation._id)
      .populate('taskId', 'name code')
      .populate('recordedBy', 'firstName lastName militaryRank')
      .populate('ratings.soldier', 'firstName lastName militaryRank')
      .populate('createdBy', 'username');

    res.status(201).json(populatedEvaluation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update evaluation
// @route   PUT /api/evaluations/:id
// @access  Private (Admin/Superuser)
exports.updateEvaluation = async (req, res) => {
  try {
    const { date, evaluationType, taskCode, taskName, recordedBy, ratings } =
      req.body;

    // Find evaluation
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Save current state to history before updating
    if (date && date !== evaluation.date.toISOString().split('T')[0]) {
      // Date is changing, save current state to history
      evaluation.history.push({
        date: evaluation.date,
        recordedBy: evaluation.recordedBy,
        ratings: evaluation.ratings,
        updatedAt: evaluation.updatedAt,
      });
    }

    // Verify recorder exists if changing
    if (recordedBy && recordedBy !== evaluation.recordedBy.toString()) {
      const recorderExists = await Soldier.findById(recordedBy);
      if (!recorderExists) {
        return res.status(404).json({ message: 'Recorder not found' });
      }
      evaluation.recordedBy = recordedBy;
    }

    // Verify all participants exist if changing
    if (ratings) {
      for (const rating of ratings) {
        const soldierExists = await Soldier.findById(rating.soldier);
        if (!soldierExists) {
          return res.status(404).json({
            message: `Soldier with ID ${rating.soldier} not found`,
          });
        }
      }
      evaluation.ratings = ratings;
    }

    // Update other fields
    if (date) evaluation.date = date;
    if (evaluationType) evaluation.evaluationType = evaluationType;
    if (taskCode) evaluation.taskCode = taskCode;
    if (taskName) evaluation.taskName = taskName;

    const updatedEvaluation = await evaluation.save();

    // Populate response with related data
    const populatedEvaluation = await Evaluation.findById(updatedEvaluation._id)
      .populate('taskId', 'name code')
      .populate('recordedBy', 'firstName lastName militaryRank')
      .populate('ratings.soldier', 'firstName lastName militaryRank')
      .populate('history.recordedBy', 'firstName lastName militaryRank')
      .populate(
        'history.ratings.soldier',
        'firstName lastName militaryRank primaryUnit'
      )
      .populate('createdBy', 'username');

    res.json(populatedEvaluation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete evaluation
// @route   DELETE /api/evaluations/:id
// @access  Private (Admin only)
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    await evaluation.deleteOne();
    res.json({ message: 'Evaluation removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get evaluation statistics by unit and time period
// @route   GET /api/evaluations/stats
// @access  Private
exports.getEvaluationStats = async (req, res) => {
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

    const evaluations = await Evaluation.find(filter).lean();

    // Calculate statistics
    const stats = {
      totalEvaluations: evaluations.length,
      officialCount: 0,
      unofficialCount: 0,
      passingRate: 0,
      ratingDistribution: {
        I: 0,
        IA: 0,
        NI: 0,
        '-': 0,
      },
      taskPerformance: {},
    };

    // Count by evaluation type
    evaluations.forEach((evaluation) => {
      if (evaluation.evaluationType === 'Oficialus') {
        stats.officialCount++;
      } else {
        stats.unofficialCount++;
      }

      // Track ratings
      evaluation.ratings.forEach((rating) => {
        stats.ratingDistribution[rating.rating]++;
      });

      // Track performance by task
      if (!stats.taskPerformance[evaluation.taskName]) {
        stats.taskPerformance[evaluation.taskName] = {
          total: 0,
          passed: 0,
          passRate: 0,
        };
      }

      const taskStat = stats.taskPerformance[evaluation.taskName];
      taskStat.total += evaluation.ratings.length;

      // Count passed ratings (I or IA)
      const passedCount = evaluation.ratings.filter(
        (r) => r.rating === 'I' || r.rating === 'IA'
      ).length;

      taskStat.passed += passedCount;
    });

    // Calculate passing rates
    let totalRatings = 0;
    let totalPassed = 0;

    Object.keys(stats.taskPerformance).forEach((task) => {
      const taskStat = stats.taskPerformance[task];
      taskStat.passRate =
        taskStat.total > 0 ? (taskStat.passed / taskStat.total) * 100 : 0;

      totalRatings += taskStat.total;
      totalPassed += taskStat.passed;
    });

    // Calculate overall passing rate
    stats.passingRate =
      totalRatings > 0 ? (totalPassed / totalRatings) * 100 : 0;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
