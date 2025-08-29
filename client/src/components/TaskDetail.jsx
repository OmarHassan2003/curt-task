import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/api/v1/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data.data);
        setTitle(res.data.data.title);
        setStatus(res.data.data.status);
      } catch (err) {
        toast.error('Failed to load task. Redirecting...');
        navigate('/projects');
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `http://localhost:3000/api/v1/tasks/${id}`,
        { title, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTask(res.data.data);
      toast.success('Task updated successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update task';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/v1/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Task deleted successfully');
      navigate(`/projects/${task.projectId}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete task';
      toast.error(errorMessage);
    }
  };

  if (!task)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case 'ToDo':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'InProgress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link
              to={`/projects/${task.projectId}`}
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
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
              <div className="flex items-center mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Task</h2>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50"
                    required
                    disabled={isLoading}
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50"
                    disabled={isLoading}
                  >
                    <option value="ToDo">📋 To Do</option>
                    <option value="InProgress">⚡ In Progress</option>
                    <option value="Done">✅ Done</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                      isLoading
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      'Update Task'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Created</span>
                  <span className="text-sm text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">Task ID</span>
                  <span className="text-sm text-gray-500 font-mono">{task._id.slice(-8)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setStatus('ToDo')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                    status === 'ToDo'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📋 Mark as To Do
                </button>
                <button
                  onClick={() => setStatus('InProgress')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                    status === 'InProgress'
                      ? 'bg-yellow-100 text-yellow-900'
                      : 'text-gray-600 hover:bg-yellow-50'
                  }`}
                >
                  ⚡ Start Progress
                </button>
                <button
                  onClick={() => setStatus('Done')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                    status === 'Done'
                      ? 'bg-green-100 text-green-900'
                      : 'text-gray-600 hover:bg-green-50'
                  }`}
                >
                  ✅ Mark as Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
