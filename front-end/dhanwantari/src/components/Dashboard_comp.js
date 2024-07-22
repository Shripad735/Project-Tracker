import React from 'react';
import OptionCard from './OptionCard';
import Navbar from './Navbar';
import './Dashboard.css';

function DashboardComp() {
    return (
        <div>
            <Navbar />
        <div className="dashboard">
            <h2>Welcome to Your Dashboard</h2>
            <div className="option-cards">
                <OptionCard title="View Assigned Tasks" description="View all deliverables in a single place" />
                <OptionCard title="Submit Completion Proofs" description="Make submissions for your completed tasks" />
                <OptionCard title="View Rejected Tasks" description="Verify tasks that have been rejected" />
            </div>
        </div>
        </div>
    );
}

export default DashboardComp;
