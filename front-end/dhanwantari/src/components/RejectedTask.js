import React from 'react';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import Sidebar from './Sidebar'; // Assuming you have a Sidebar component
import './RejectedTask.css';

const rejectedTasks = [
    {
        name: "Task/Project name",
        reason: "The document does not meet the required standards.",
        rejectedBy: "Suresh Jha",
        content: "Content of the rejected document...(.jpg/.pdf file)"
    },
    {
        name: "Task/Project name",
        reason: "The document does not meet the required standards.",
        rejectedBy: "Maruti Desai",
        content: "Content of the rejected document...(.jpg/.pdf file)"
    },
    // Add more rejected tasks as needed
];

function RejectedTask() {
    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <Sidebar className="sidebar" />
                <div className="dashboard">
                    <h2>Rejected Tasks</h2>
                    <div className="rejected-work-list">
                        {rejectedTasks.map((task, index) => (
                            <div className="rejected-work-card" key={index}>
                                <div className="rejected-work-info">
                                    <h3>{task.name}</h3>
                                    <p className="rejection-reason">Reason for rejection: {task.reason}</p>
                                    <p className="rejected-by">Rejected by: {task.rejectedBy}</p>
                                </div>
                                <div className="rejected-work-content">
                                    <p>{task.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RejectedTask;
