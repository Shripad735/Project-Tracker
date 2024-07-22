import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectList.css';
import Chart from 'chart.js/auto';

function ProjectList() {
    const projects = [
        { id: 1, name: 'Project A', completion: 50 },
        { id: 2, name: 'Project B', completion: 75 },
        { id: 3, name: 'Project C', completion: 30 },
        // Add more projects as needed
    ];

    const chartRefs = useRef({});
    const navigate = useNavigate();

    useEffect(() => {
        projects.forEach(project => {
            renderChart(`chart${project.id}`, project.completion);
        });

        // Cleanup function to destroy charts
        return () => {
            Object.values(chartRefs.current).forEach(chart => {
                chart.destroy();
            });
        };
    }, [projects]);

    const renderChart = (id, completion) => {
        const ctx = document.getElementById(id).getContext('2d');

        // Destroy existing chart instance if it exists
        if (chartRefs.current[id]) {
            chartRefs.current[id].destroy();
        }

        // Create new chart instance and store it in the ref
        chartRefs.current[id] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [completion, 100 - completion],
                    backgroundColor: ['#360fd0', '#e0e0e0'],
                    cutout: '60%'
                }]
            }
        });
    };

    const handleProjectClick = (id) => {
        navigate(`/project/${id}`);
    };

    return (
        <div className="project-list">
            <h2>List of Projects</h2>
            <ol>
                {projects.map(project => (
                    <li key={project.id} className="project" onClick={() => handleProjectClick(project.id)}>
                        <div className="chart-container">
                            <canvas id={`chart${project.id}`}></canvas>
                        </div>
                        <div className="project-title">{project.name}</div>
                        <a href="#">View Project</a>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default ProjectList;
