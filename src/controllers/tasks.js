const Task = require("../models/task");

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getAllTasks = async (req, res) => {
  try {
    // Filter by type if specified
    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const tasks = await Task.find(filter)
      .sort({ name: 1 })
      .populate("createdBy", "username");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "createdBy",
      "username"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin/Superuser)
exports.createTask = async (req, res) => {
  try {
    const { code, name, description, type } = req.body;

    // Check if task with same code already exists
    const existingTaskByCode = await Task.findOne({ code });
    if (existingTaskByCode) {
      return res
        .status(400)
        .json({ message: "A task with this code already exists" });
    }

    // Check if task with same name already exists
    const existingTask = await Task.findOne({ name });
    if (existingTask) {
      return res
        .status(400)
        .json({ message: "A task with this name already exists" });
    }

    const task = await Task.create({
      name,
      description,
      type,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (Admin/Superuser)
exports.updateTask = async (req, res) => {
  try {
    const { code, name, description, type } = req.body;

    // Find task
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // If code is changing, check for duplicates
    if (code && code !== task.code) {
      const existingTaskByCode = await Task.findOne({ code });
      if (existingTaskByCode) {
        return res
          .status(400)
          .json({ message: "A task with this code already exists" });
      }
      task.code = code;
    }

    // If name is changing, check for duplicates
    if (name && name !== task.name) {
      const existingTask = await Task.findOne({ name });
      if (existingTask) {
        return res
          .status(400)
          .json({ message: "A task with this name already exists" });
      }
    }

    // Update fields
    task.name = name || task.name;
    task.description = description || task.description;
    task.type = type || task.type;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    res.json({ message: "Task removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
