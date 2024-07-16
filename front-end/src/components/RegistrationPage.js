// project-tracker-frontend/src/components/RegistrationPage.js
import React from 'react';
import './RegistrationPage.css';

const RegistrationPage = () => {
  return (
    <div className="container">
      <h2>Register for Project Tracker</h2>
      <form action="/register" method="POST">
        <input type="text" name="full_name" placeholder="Full Name" required />
        <input type="email" name="email" placeholder="E-mail" required />
        <input type="tel" name="mobile" placeholder="Mobile" required />
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Create Password" required />
        <input type="password" name="confirm_password" placeholder="Confirm Password" required />
        
        <div className="user-type-selection">
          <label className="user-type-option">
            <input type="radio" name="user_type" value="ProjectVisionary" required />
            Project Visionary
          </label>
          <label className="user-type-option">
            <input type="radio" name="user_type" value="Taskmaster" required />
            Taskmaster
          </label>
        </div>
        
        <button type="submit">Register</button>
      </form>
      <a href="/login" className="login-link">Already have an account? Login here</a>
    </div>
  );
};

export default RegistrationPage;
