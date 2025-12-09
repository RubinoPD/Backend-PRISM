const express = require('express');
const router = express.Router();
const { protect, adminOnly, adminOrSuperuser } = require('../middleware/auth');
const {
  getAllAttendance,
  getAttendanceByDate,
  createAttendance,
  bulkCreateAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats,
} = require('../controllers/attendance');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', getAllAttendance);
router.get('/stats', getAttendanceStats);
router.get('/date/:date', getAttendanceByDate);

// Routes accessible by admin and superuser
router.post('/', adminOrSuperuser, createAttendance);
router.post('/bulk', adminOrSuperuser, bulkCreateAttendance);
router.put('/:id', adminOrSuperuser, updateAttendance);
router.delete('/:id', adminOrSuperuser, deleteAttendance);

module.exports = router;
