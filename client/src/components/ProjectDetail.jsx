import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('ToDo');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/api/v1/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data.data);
        setNewTitle(res.data.data.title);
        setNewDescription(res.data.data.description || '');
      } catch (err) {
        toast.error('Failed to load project. Redirecting...');
        navigate('/projects');
      }
    };

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/api/v1/tasks/project/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data.data);
      } catch (err) {
        toast.error('Failed to load tasks');
      }
    };

    fetchProject();
    fetchTasks();
  }, [id, navigate]);

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setIsLoadingProject(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `http://localhost:3000/api/v1/projects/${id}`,
        { title: newTitle, description: newDescription },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProject(res.data.data);
      toast.success('Project updated successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update project';
      toast.error(errorMessage);
    } finally {
      setIsLoadingProject(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsLoadingTask(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:3000/api/v1/tasks',
        { projectId: id, title, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks([...tasks, res.data.data]);
      setTitle('');
      setStatus('ToDo');
      toast.success('Task created successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create task';
      toast.error(errorMessage);
    } finally {
      setIsLoadingTask(false);
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/v1/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete task';
      toast.error(errorMessage);
    }
  };

  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/projects"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-600 mt-1">{project.description || 'No description'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Update Project Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Project</h2>
          <form onSubmit={handleUpdateProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 disabled:bg-gray-50"
                  required
                  disabled={isLoadingProject}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="Project Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 disabled:bg-gray-50"
                  disabled={isLoadingProject}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoadingProject}
                className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                  isLoadingProject
                    ? 'bg-green-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isLoadingProject ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Project'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          </div>

          {/* Create Task Form */}
          <div className="p-6 bg-gray-50">
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50"
                    required
                    disabled={isLoadingTask}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50"
                    disabled={isLoadingTask}
                  >
                    <option value="ToDo">To Do</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoadingTask}
                  className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                    isLoadingTask
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoadingTask ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    '+ Add Task'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tasks List */}
          <div className="p-6">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-500">Add your first task to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => {
                  const getStatusColor = (status) => {
                    switch (status) {
                      case 'ToDo':
                        return 'bg-gray-100 text-gray-800';
                      case 'InProgress':
                        return 'bg-yellow-100 text-yellow-800';
                      case 'Done':
                        return 'bg-green-100 text-green-800';
                      default:
                        return 'bg-gray-100 text-gray-800';
                    }
                  };

                  return (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex-1">
                        <Link to={`/tasks/${task._id}`} className="block">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {task.title}
                          </h3>
                          <div className="flex items-center mt-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status}
                            </span>
                          </div>
                        </Link>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task._id, task.title)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete task"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
