const AppError = require('../utils/appError');
const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');

const createTask = catchAsync(async (req, res, next) => {
  const { title, status, projectId } = req.body;

  const task = await Task.create({
    title,
    status,
    projectId,
  });

  res.status(201).json({
    status: 'success',
    data: task,
  });
});

const getTasks = catchAsync(async (req, res) => {
  const tasks = await Task.find();

  res.status(200).json({
    status: 'success',
    data: tasks,
  });
});

const getTasksForProject = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ projectId: req.params.projectId });
  res.status(200).json({
    status: 'success',
    data: tasks,
  });
});

const getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) return next(new AppError('Task not found', 404));

  res.status(200).json({
    status: 'success',
    data: task,
  });
});

const updateTask = catchAsync(async (req, res, next) => {
  const { title, status } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, status },
    { new: true, runValidators: true }
  );

  if (!task) return next(new AppError('Task not found', 404));

  res.status(200).json({
    status: 'success',
    data: task,
  });
});

const deleteTask = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;

  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    return next(new AppError('No task found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  getTasksForProject,
  deleteTask,
};
