const Project = require('../models/projectsModel');
const AppError = require('../utils/appError');
const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');

const createProject = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;

  const project = await Project.create({
    title,
    description,
  });

  res.status(201).json({
    status: 'success',
    data: project,
  });
});

const getProjects = catchAsync(async (req, res) => {
  const projects = await Project.find();
  res.status(200).json({
    status: 'success',
    data: projects,
  });
});

const getProjectById = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) return next(new AppError('Project not found', 404));

  res.status(200).json({
    status: 'success',
    data: project,
  });
});

const updateProject = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { title, description },
    { new: true, runValidators: true }
  );

  if (!project) return next(new AppError('Project not found', 404));

  res.status(200).json({
    status: 'success',
    data: project,
  });
});

const deleteProject = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;

  await Task.deleteMany({ projectId: projectId });

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    return next(new AppError('No project found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
