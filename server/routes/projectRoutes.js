const express = require('express');
const { protect } = require('../controllers/authController');

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();

router.route('/').get(protect, getProjects).post(protect, createProject);
router
  .route('/:id')
  .get(protect, getProjectById)
  .patch(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
