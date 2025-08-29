const express = require('express');
const { protect } = require('../controllers/authController');

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksForProject,
} = require('../controllers/taskController');

const router = express.Router();

router.route('/').get(protect, getTasks).post(protect, createTask);
router
  .route('/:id')
  .get(protect, getTaskById)
  .patch(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/project/:projectId').get(protect, getTasksForProject);

module.exports = router;
