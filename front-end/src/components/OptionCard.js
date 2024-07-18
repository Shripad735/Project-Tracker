import React from 'react';
import './OptionCard.css';
import { FaPlus, FaTasks, FaCheckCircle } from 'react-icons/fa';
import { FaUpload, FaTimesCircle } from 'react-icons/fa';

const iconMap = {
    "Create New Project": <FaPlus size={50} />,
    "Manage Existing Projects": <FaTasks size={50} />,
    "Pending Verification of Tasks": <FaCheckCircle size={50} />,
    "View Assigned Tasks": <FaTasks size={50} />,
    "View Rejected Tasks": <FaTimesCircle size={50} />,
    "Submit Completion Proofs": <FaUpload size={50} />
};

function OptionCard({ title, description }) {
    return (
        <div className="option-card">
            <div className="icon">
                {iconMap[title]}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export default OptionCard;
