const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Hello! Welcome to server</h1>');
});

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'super30_project'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

const executeQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

// Retrieve all users
app.get('/allusers', async (req, res) => {
    try {
        const users = await executeQuery('SELECT * FROM users', []);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all projects
app.get('/allprojects', async (req, res) => {
    try {
        const projects = await executeQuery('SELECT * FROM projects', []);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all milestones for a project
app.get('/allmilestones/:id', async (req, res) => {
    try {
        const projectid = req.params.id;
        const milestones = await executeQuery('SELECT * FROM milestones WHERE projectid = ?', [projectid]);
        res.json(milestones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve a milestone by ID
app.get('/milestones/:pid/:mid', async (req, res) => {
    try {
        const { pid, mid } = req.params;
        const milestone = await executeQuery('SELECT * FROM milestones WHERE projectid = ? AND milestoneid = ?', [pid, mid]);
        res.json(milestone);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all tasks for a milestone
app.get('/alltasks/:mid', async (req, res) => {
    try {
        const milestoneid = req.params.mid;
        const tasks = await executeQuery('SELECT * FROM tasks WHERE milestoneid = ?', [milestoneid]);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve a task by ID
app.get('/tasks/:pid/:mid/:tid', async (req, res) => {
    try {
        const {pid, mid, tid } = req.params;
        const task = await executeQuery('SELECT * FROM tasks WHERE projectid=? AND milestoneid = ? AND taskid = ?', [pid,mid, tid]);
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieves all tasks assigned to a user
app.get('/api/tasks/assignedto/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;
        const tasks = await executeQuery('SELECT * FROM tasks WHERE assignedto = ?', [userid]);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search for users by name or email
app.get('/api/users/search', async (req, res) => {
    try {
        const query = req.query.q;
        const users = await executeQuery('SELECT * FROM users WHERE username LIKE ? OR email LIKE ?', [`%${query}%`, `%${query}%`]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all projects a user is assigned to
app.get('/api/users/:id/projects', async (req, res) => {
    try {
        const userid = req.params.id;
        const query = `
            SELECT p.*
            FROM projects p
            JOIN assignments a ON p.ProjectID = a.ProjectID
            WHERE a.UserID = ?
        `;
        const projects = await executeQuery(query, [userid]);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Search for projects by name or description
app.get('/api/projects/search', async (req, res) => {
    try {
        const query = req.query.q;
        const projects = await executeQuery('SELECT * FROM projects WHERE ProjectName LIKE ? OR description LIKE ?', [`%${query}%`, `%${query}%`]);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// // Retrieve all milestones for a project
// app.get('/api/projects/:id/milestones', async (req, res) => {
//     try {
//         const projectid = req.params.id;
//         const milestones = await executeQuery('SELECT * FROM milestones WHERE projectid = ?', [projectid]);
//         res.json(milestones);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Search for tasks by name or description
app.get('/api/tasks/search', async (req, res) => {
    try {
        const query = req.query.q;
        const tasks = await executeQuery('SELECT * FROM tasks WHERE TaskName LIKE ? OR description LIKE ?', [`%${query}%`, `%${query}%`]);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// // Retrieve all comments for a task 
// app.get('/api/tasks/:id/comments', async (req, res) => {
//     try {
//         const taskid = req.params.id;
//         const comments = await executeQuery('SELECT * FROM comments WHERE taskid = ?', [taskid]);
//         res.json(comments);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Search for milestones by name or description
app.get('/api/milestones/search', async (req, res) => {
    try {
        const query = req.query.q;
        const milestones = await executeQuery('SELECT * FROM milestones WHERE MilestoneName LIKE ? OR description LIKE ?', [`%${query}%`, `%${query}%`]);
        res.json(milestones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all tasks for a milestone 
// app.get('/api/milestones/:id/tasks', async (req, res) => {
//     try {
//         const milestoneid = req.params.id;
//         const tasks = await executeQuery('SELECT * FROM tasks WHERE milestoneid = ?', [milestoneid]);
//         res.json(tasks);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Retrieve all assignments
app.get('/api/assignments', async (req, res) => {
    try {
        const assignments = await executeQuery('SELECT * FROM assignments', []);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve an assignment by ID
app.get('/api/assignments/:id', async (req, res) => {
    try {
        const assignmentid = req.params.id;
        const assignment = await executeQuery('SELECT * FROM assignments WHERE id = ?', [assignmentid]);
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all completion proofs
app.get('/api/completionproofs', async (req, res) => {
    try {
        const proofs = await executeQuery('SELECT * FROM completionproofs', []);
        res.json(proofs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve a completion proof by ID
app.get('/api/completionproofs/:id', async (req, res) => {
    try {
        const proofid = req.params.id;
        const proof = await executeQuery('SELECT * FROM completionproofs WHERE Taskid = ?', [proofid]);
        res.json(proof);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all notifications
app.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await executeQuery('SELECT * FROM notifications', []);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve a notification by ID
app.get('/api/notifications/:id', async (req, res) => {
    try {
        const notificationid = req.params.id;
        const notification = await executeQuery('SELECT * FROM notifications WHERE Userid = ?', [notificationid]);
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//NEW

//Retrive userid ,task id whose completionproof is pending 
app.get('/api/tasks/pendingcompletionproofs', async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT u.UserID, t.TaskID
            FROM completionproofs cp
            JOIN tasks t ON cp.TaskID = t.TaskID
            JOIN users u ON t.AssignedTo = u.UserID
            WHERE cp.Status = 'Pending'
        `;
        const pendingCompletionProofs = await executeQuery(query, []);
        res.json(pendingCompletionProofs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Detrive the projects who have surpassed the EndDate and still not completed 
app.get('/api/projects/surpassedenddate', async (req, res) => {
    try {
        const query = `
            SELECT *
            FROM projects
            WHERE EndDate < CURDATE()
            AND Status != 'Completed'
        `;
        const projectsSurpassedEndDate = await executeQuery(query, []);
        res.json(projectsSurpassedEndDate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Rtrive the status and userId of perticular project 
app.get('/api/projects/:projectId/details', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const query = `
            SELECT p.Status, a.UserID
            FROM projects p
            JOIN assignments a ON p.ProjectID = a.ProjectID
            WHERE p.ProjectID = ?
        `;
        const projectDetails = await executeQuery(query, [projectId]);
        res.json(projectDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve tasks by status
app.get('/api/tasks/status/:status', async (req, res) => {
    try {
        const status = req.params.status;
        const tasks = await executeQuery('SELECT * FROM tasks WHERE status = ?', [status]);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve tasks with assigned user details
app.get('/api/tasks/withusers', async (req, res) => {
    try {
        const query = `
            SELECT t.*, u.Username as AssignedUsername, u.Email as AssignedEmail
            FROM tasks t
            JOIN users u ON t.AssignedTo = u.UserID
        `;
        const tasksWithUsers = await executeQuery(query, []);
        res.json(tasksWithUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve projects with milestone counts and task counts
app.get('/api/projects/withcounts', async (req, res) => {
    try {
        const query = `
            SELECT p.*, COUNT(DISTINCT m.MilestoneID) as MilestoneCount, COUNT(t.TaskID) as TaskCount
            FROM projects p
            LEFT JOIN milestones m ON p.ProjectID = m.ProjectID
            LEFT JOIN tasks t ON m.MilestoneID = t.MilestoneID
            GROUP BY p.ProjectID
        `;
        const projectsWithCounts = await executeQuery(query, []);
        res.json(projectsWithCounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
