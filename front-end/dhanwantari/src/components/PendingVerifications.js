import React from 'react';
import { Link } from 'react-router-dom';
import './PendingVerifications.css';

const PendingVerifications = () => {
  // Sample data
  const pendingTasks = [
    { id: 1, name: 'Task 1 of milestone 1 of Project Alpha' },
    { id: 2, name: 'Task 2 of milestone 2 of Project Beta' },
    { id: 3, name: 'Task 3 of milestone 1 of Project Gamma' },
  ];

  return (
    <div className="pending-verifications-container">
      <div className="pending-verifications-card">
        <h1 className="pending-verifications-title">Pending Verifications</h1>
        {pendingTasks.map((task, index) => (
          <div key={task.id} className="pending-task-item">
            <span className="pending-task-name">{`${index + 1}. ${task.name}`}</span>
            <Link
              to={`/proof/${task.id}`}
              className="see-proof-button"
            >
              See Proof
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingVerifications;