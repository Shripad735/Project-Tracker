import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProofDetails.css';

const ProofDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  // Sample data
  const sampleTask = {
    id: taskId,
    name: `Task ${taskId} of milestone 1 of Project Alpha`,
    submittedBy: 'Parth Kulkarni',
    submittedAt: '2024-07-12T14:36:00Z',
    proofFileName: 'task1completion.pdf',
    proofUrl: '#',
    status: 'Pending'
  };

  const [status, setStatus] = useState(sampleTask.status);

  const handleSubmit = () => {
    // Simulate API call
    console.log(`Status updated to: ${status}`);
    navigate('/pending-verifications');
  };

  return (
    <div className="proof-details-container">
      <div className="proof-details-card">
        <h1 className="proof-details-title">{sampleTask.name}</h1>
        <div className="proof-info">
          <p>Submitted by: {sampleTask.submittedBy}</p>
          <p>Submitted at: {new Date(sampleTask.submittedAt).toLocaleString()}</p>
          <a
            href={sampleTask.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="proof-file-link"
          >
            {sampleTask.proofFileName}
          </a>
        </div>
        <div className="status-select-container">
          <label htmlFor="status" className="status-select-label">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="status-select"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="submit-button"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProofDetails;