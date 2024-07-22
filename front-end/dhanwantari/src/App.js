// project-tracker-frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landingPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Dashboard from './components/Dashboard';
import DashboardComp from './components/Dashboard_comp';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProjectList from './components/ProjectList';
import ProjectTimeline from './components/ProjectTimeline';
import RejectedTask from './components/RejectedTask';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard_comp" element={<DashboardComp /> } />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/projectlist" element={<ProjectList />} />
        <Route path="/project/:id" element={<ProjectTimeline />} />
        <Route path="/rejectedtasks" element={<RejectedTask />} />
        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>
    </Router>
  );
}

export default App;
