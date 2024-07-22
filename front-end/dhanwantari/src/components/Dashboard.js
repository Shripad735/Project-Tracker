// Dashboard.js
import React from 'react';
import OptionCard from './OptionCard';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom'; 
import './Dashboard.css';

function Dashboard() {
    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <Sidebar />
                <div className="dashboard">
                    <h2>Welcome to Your Dashboard</h2>
                    <div className="option-cards">
                        <OptionCard
                            title="Create New Project"
                            description="Start a new project and track its progress."
                        />
                        <Link to="/projectlist">
                            <OptionCard
                                title="Manage Existing Projects"
                                description="View and manage your existing projects."
                            />
                        </Link>
                        <OptionCard
                            title="Pending Verification of Tasks"
                            description="Verify tasks that are pending approval."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
