import React from 'react';
import './Navbar.css';
import { FaUserCircle } from 'react-icons/fa';

function Navbar() {
    return (
        <div className="navbar">
            <h1>Project Tracker</h1>
            <div className="right-section">
                <div className="user-info">
                    <span>Welcome, Parth</span>
                    <button>Logout</button>
                </div>
                <div className="profile">
                    <FaUserCircle size={40} className="profile-icon" />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
