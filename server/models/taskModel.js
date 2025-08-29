const mongoose = require('mongoose');
const Project = require('./projectsModel');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    status: {
      type: String,
      required: [true, 'A task must have a status'],
      default: 'ToDo',
      enum: {
        values: ['ToDo', 'InProgress', 'Done'],
        message: 'Status can only have 3 stats: ToDo, InProgress or Done',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'Task must belong to a project'],
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
