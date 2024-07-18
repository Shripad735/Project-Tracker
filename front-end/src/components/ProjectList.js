import React from 'react';
import './ProjectList.css';

function ProjectList() {
    const projects = [
        { id: 1, name: 'Project A', description: 'Description of Project A' },
        { id: 2, name: 'Project B', description: 'Description of Project B' },
        // Add more projects as needed
    ];

    return (
        <div className="project-list">
            {projects.map(project => (
                <div key={project.id} className="project-card">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    );
}

export default ProjectList;
