// project-tracker-frontend/src/components/LandingPage.js
import React from 'react';
import './landingPage.css';
import FeatureCard from './FeatureCard';
import { FaBell, FaUsers, FaFileAlt } from 'react-icons/fa';

const LandingPage = () => {
  const features = [
    {
      icon: <FaBell />,
      title: 'Track Alert',
      description1: 'Set all deadlines & get notified',
    },
    {
      icon: <FaUsers />,
      title: 'Multi Users',
      description1: 'Assign different tasks to different team members',
    },
    {
      icon: <FaFileAlt />,
      title: 'Submissions',
      description1: 'Monitor work done by team',
    }
  ];

  return (
    <div className="landing-page gradient-background">
      <h1>Welcome to Project Tracker</h1>
      <p>Stay on Track, Every Step of the Way!</p>
      
      <div className="features">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description1={feature.description1}
          />
        ))}
      </div>
      <br />
      <br/>
      <div> <button className='button-73'  style = {{marginTop: '20px',
marginLeft: '39px'}}>Get started now</button></div>
      
    </div>
  );
};

export default LandingPage;
