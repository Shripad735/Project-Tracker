import React from 'react';
import OptionCard from './OptionCard';
import './Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard">
            <h2>Welcome to Your Dashboard</h2>
            <div className="option-cards">
                <OptionCard title="Create New Project" description="Start a new project and track its progress." />
                <OptionCard title="Manage Existing Projects" description="View and manage your existing projects." />
                <OptionCard title="Pending Verification of Tasks" description="Verify tasks that are pending approval." />
            </div>
        </div>
    );
}

export default Dashboard;
