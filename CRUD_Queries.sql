-- Fetch all users
-- Use case: To display a list of all users
SELECT * FROM Users;

-- Fetch a user by ID
-- Use case: To display details of a specific user
SELECT * FROM Users WHERE UserID = 1;

-- Fetch all employees (excluding admins)
-- Use case: To display a list of all employees
SELECT * FROM Users WHERE UserTypeID = (SELECT UserTypeID FROM UserTypes WHERE TypeName = 'Employee');

-- Fetch all projects
-- Use case: To display a list of all projects
SELECT * FROM Projects;

-- Fetch project by ID
-- Use case: To display details of a specific project
SELECT * FROM Projects WHERE ProjectID = 1;

-- Fetch all milestones for a project
-- Use case: To display all milestones for a specific project
SELECT * FROM Milestones WHERE ProjectID = 1;

-- Fetch all tasks
-- Use case: To display a list of all tasks
SELECT * FROM Tasks;

-- Fetch all tasks for a specific project
-- Use case: To display all tasks for a specific project
SELECT * FROM Tasks WHERE ProjectID = 1;

-- Fetch all tasks assigned to a specific user
-- Use case: To display all tasks assigned to a specific user
SELECT * FROM Tasks WHERE AssignedTo = 2;

-- Fetch all tasks for a specific milestone
-- Use case: To display all tasks for a specific milestone
SELECT * FROM Tasks WHERE MilestoneID = 1;

-- Fetch all assignments
-- Use case: To display a list of all assignments
SELECT * FROM Assignments;

-- Fetch all assignments for a specific user
-- Use case: To display all assignments for a specific user
SELECT * FROM Assignments WHERE UserID = 2;

-- Fetch all completion proofs
-- Use case: To display a list of all completion proofs
SELECT * FROM CompletionProofs;

-- Fetch completion proofs by task ID
-- Use case: To display completion proofs for a specific task
SELECT * FROM CompletionProofs WHERE TaskID = 1;

-- Fetch completion proofs by user ID
-- Use case: To display all completion proofs submitted by a specific user
SELECT * FROM CompletionProofs WHERE SubmittedBy = 2;

-- Fetch all notifications
-- Use case: To display a list of all notifications
SELECT * FROM Notifications;

-- Fetch all notifications for a specific user
-- Use case: To display all notifications for a specific user
SELECT * FROM Notifications WHERE UserID = 2;

-- Fetch all notifications for a specific project
-- Use case: To display all notifications related to a specific project
SELECT * FROM Notifications WHERE ProjectID = 1;

-- Fetch all tasks along with their project and milestone details
-- Use case: To display all tasks along with related project and milestone information
SELECT 
    Tasks.TaskID, 
    Tasks.TaskName, 
    Tasks.Description AS TaskDescription, 
    Projects.ProjectName, 
    Milestones.MilestoneName 
FROM 
    Tasks
INNER JOIN 
    Projects ON Tasks.ProjectID = Projects.ProjectID
INNER JOIN 
    Milestones ON Tasks.MilestoneID = Milestones.MilestoneID;

-- Fetch all tasks for a specific user along with project and milestone details
-- Use case: To display all tasks assigned to a specific user along with related project and milestone information
SELECT 
    Tasks.TaskID, 
    Tasks.TaskName, 
    Tasks.Description AS TaskDescription, 
    Projects.ProjectName, 
    Milestones.MilestoneName 
FROM 
    Tasks
INNER JOIN 
    Projects ON Tasks.ProjectID = Projects.ProjectID
INNER JOIN 
    Milestones ON Tasks.MilestoneID = Milestones.MilestoneID
WHERE 
    Tasks.AssignedTo = 2;

-- Fetch all users along with their assigned tasks and project details
-- Use case: To display all users along with their assigned tasks and related project information
SELECT 
    Users.UserID, 
    Users.Username, 
    Tasks.TaskID, 
    Tasks.TaskName, 
    Projects.ProjectName 
FROM 
    Users
LEFT JOIN 
    Tasks ON Users.UserID = Tasks.AssignedTo
LEFT JOIN 
    Projects ON Tasks.ProjectID = Projects.ProjectID;

-- List Tasks for a Specific Project
-- Use case: Display tasks when viewing a project
SELECT t.TaskID, t.TaskName, t.Status, u.Username AS AssignedTo, t.StartDate, t.EndDate
FROM Tasks t
JOIN Users u ON t.AssignedTo = u.UserID
WHERE t.ProjectID = 1
ORDER BY t.StartDate;

-- Get User's Assigned Tasks
-- Use case: Show tasks assigned to the logged-in user
SELECT t.TaskID, p.ProjectName, t.TaskName, t.Status, t.EndDate
FROM Tasks t
JOIN Projects p ON t.ProjectID = p.ProjectID
WHERE t.AssignedTo = 2
ORDER BY t.EndDate;


-- Project Progress
-- Use case: Calculate overall project progress for reporting
SELECT p.ProjectID, p.ProjectName,
       COUNT(t.TaskID) AS TotalTasks,
       SUM(CASE WHEN t.Status = 'Completed' THEN 1 ELSE 0 END) AS CompletedTasks,
       (SUM(CASE WHEN t.Status = 'Completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(t.TaskID)) AS ProgressPercentage
FROM Projects p
LEFT JOIN Tasks t ON p.ProjectID = t.ProjectID
GROUP BY p.ProjectID;

-- Overdue Tasks
-- Use case: Alert admins about overdue tasks
SELECT t.TaskID, t.TaskName, p.ProjectName, u.Username AS AssignedTo, t.EndDate
FROM Tasks t
JOIN Projects p ON t.ProjectID = p.ProjectID
JOIN Users u ON t.AssignedTo = u.UserID
WHERE t.EndDate < CURDATE() AND t.Status != 'Completed'
ORDER BY t.EndDate;

-- Notification Summary
-- Use case: Display user notifications
SELECT n.NotificationID, n.Message, p.ProjectName, t.TaskName, n.CreatedAt
FROM Notifications n
LEFT JOIN Projects p ON n.ProjectID = p.ProjectID
LEFT JOIN Tasks t ON n.TaskID = t.TaskID
WHERE n.UserID = 2
ORDER BY n.CreatedAt DESC
LIMIT 10;
