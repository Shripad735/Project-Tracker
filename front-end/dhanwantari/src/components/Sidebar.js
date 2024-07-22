import React from 'react';
import './Sidebar.css';
import { FaBell } from 'react-icons/fa';

function Sidebar() {
    return (
        <div className="sidebar">
            <h3>Notifications <FaBell /></h3>
            <ul>
                <li>No new notifications</li>
                {/* Add more notifications as needed */}
            </ul>
        </div>
    );
}

export default Sidebar;
