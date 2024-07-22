import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProjectTimeline.css';

function ProjectTimeline() {
    const { id } = useParams();

    useEffect(() => {
        const tasks = document.querySelectorAll('.task');
        const milestones = document.querySelectorAll('.milestone');
        const completedLine = document.querySelector('.completed-line');
        const taskInfo = document.getElementById('taskInfo');

        let totalTasks = tasks.length;
        let totalMilestones = milestones.length;

        // Calculate percentage of completed tasks/milestones
        let completedTasks = document.querySelectorAll('.task.completed').length;
        let completedMilestones = document.querySelectorAll('.milestone.completed').length;

        let tasksPercentage = (completedTasks / totalTasks) * 100;
        let milestonesPercentage = (completedMilestones / totalMilestones) * 100;

        // Set height of completed-line dynamically
        let maxHeight = Math.max(tasksPercentage, milestonesPercentage);
        completedLine.style.height = maxHeight + '%';

               // Update milestone completion based on tasks completion
               milestones.forEach((milestone, index) => {
                let allTasksCompleted = true;
    
                for (let i = 0; i <= index * 3; i++) {
                    if (!tasks[i].classList.contains('completed')) {
                        allTasksCompleted = false;
                        break;
                    }
                }
    
                if (allTasksCompleted) {
                    milestone.classList.add('completed');
                }
            });

        // Show task info on click
        tasks.forEach(task => {
            task.addEventListener('click', () => {
                taskInfo.textContent = task.dataset.info;
                taskInfo.style.top = task.offsetTop +110+ 'px';      /*on click on point the text box apper in that line */
                taskInfo.style.display = 'block';                /*display block on click*/        
            });
        });

        milestones.forEach(milestone => {
            milestone.addEventListener('click', () => {
                taskInfo.textContent = milestone.dataset.info;
                taskInfo.style.top = milestone.offsetTop +150+ 'px';
                taskInfo.style.display = 'block';
            });
        });

        // Hide task info on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains('task') 
            && !e.target.classList.contains('milestone') 
            && !e.target.classList.contains('task-label') 
            && !e.target.classList.contains('milestone-label') 
            && !e.target.closest('.task') 
            && !e.target.closest('.milestone')) {
                taskInfo.style.display = 'none';
            }
        });
    });

    const timelineHtml = `
     <div class="vertical-line-container">
        <div class="start-date">Start Date: 01 Jan 2024</div>
        <div class="vertical-line">
            <div class="vertical-line completed-line" style="height: 0%;"></div>
            <div class="task task1 completed" data-info="Task name                 
                                                         Assigned to: John Doe
                                                         Deadline: 15 Jan
                                                         Verification status: Approved.">
                <div class="task-label">Task 1: 15 Jan</div>
            </div>
            <div class="task task2 completed" data-info="Task name 
                                                          Assigned to: John Doe
                                                          Deadline: 15 Jan
                                                          Verification status: Approved.">
                <div class="task-label">Task 2: 15 Feb</div>
            </div>
            <div class="task task3 completed" data-info="Task name 
            Assigned to: John Doe
            Deadline: 15 Jan
            Verification status: Approved.">
                <div class="task-label">Task 3: 15 Mar</div>
            </div>
            <div class="milestone milestone1 " data-info='Milestone 1: Deadline:
            Users involved: '>
                <div class="milestone-label">Milestone 1: 15 Mar</div>
            </div>
            <div class="task task4 completed" data-info="Task name 
            Assigned to: John Doe
            Deadline: 15 Jan
            Verification status: Approved.">
                <div class="task-label">Task 4: 15 Apr</div>
            </div>
            <div class="task task5" data-info="Task name 
            Assigned to: John Doe
            Deadline: 15 Jan
            Verification status: Approved.">

                <div class="task-label">Task 5: 15 May</div>
            </div>
            <div class="task task6" data-info="Task name 
                                                          Assigned to: John Doe
                                                          Deadline: 15 Jan
                                                          Verification status: Approved.">
                <div class="task-label">Task 6: 15 Jun</div>
            </div>
            <div class="milestone milestone2 " data-info="Milestone 2: Deadline:
            Users involved: ">
                <div class="milestone-label">Milestone 2: 15 Jun</div>
            </div>
        </div>
        <div class="end-date">End Date: 31 Dec 2024</div>
    </div>

    <div class="task-info" id="taskInfo"></div>   
`;

    return (
        <div>
            <h2>Project Timeline for Project ID: {id}</h2>
            <div
                className="timeline-container"
                dangerouslySetInnerHTML={{ __html: timelineHtml }}
            />
        </div>
    );
}

export default ProjectTimeline;
