import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Signup from './components/Signup';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import TaskDetail from './components/TaskDetail';
import './tailwind.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: '#ff4b4b',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
