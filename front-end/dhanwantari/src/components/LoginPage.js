import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="container">
      <h2>Login to Project Tracker</h2>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <Link to="/register" className="register-link">
        Don't have an account? Register here
      </Link>
    </div>
  );
};

export default LoginPage;