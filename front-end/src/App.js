// project-tracker-frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate } from 'react-router-dom';
import LandingPage from './components/landingPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/LandingPage" />} />
        {/* Other routes can be added here */}
      </Routes>
    </Router>
  );
}

export default App;


