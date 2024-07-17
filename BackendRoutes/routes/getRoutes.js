module.exports = (app, executeQuery) => {
   
    // Retrieve all users   
    // Only project lead can see all users info. 
    // Project maker can only see own info 
    app.get('/allusers/:userid', async (req, res) => {
        try {
            const utype = req.session.user.UserType;
            const userid = utype == 1 ? req.params.userid : req.session.user.UserID;
            const users = await executeQuery('SELECT * FROM users where userid = ?', [userid]);
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Retrieve all projects
    // Project creator can see projects created by him only
    app.get('/allprojects', async (req, res) => {
        try {
            const userid = req.session.user.UserID;
            const projects = await executeQuery('SELECT * FROM projects where createdby = ?', [userid]);
            res.json(projects);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Retrieve all milestones for a project
    app.get('/allmilestones/:id', async (req, res) => {
        try {
            const userid = req.session.user.UserID;
            const projectid = req.params.id;
            const query = 'SELECT * FROM milestones WHERE projectid IN (SELECT projectid FROM projects WHERE createdby = ? AND projectid = ?)';
            const milestones = await executeQuery(query, [userid, projectid]);
            res.json(milestones);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Retrieve a milestone by ID
    app.get('/milestones/:pid/:mid', async (req, res) => {
        try {
            const userid = req.session.user.UserID;
            const { pid, mid } = req.params;
            const query = 'SELECT * FROM milestones WHERE milestoneid = ? AND projectid IN (SELECT projectid FROM projects WHERE createdby = ? AND projectid = ?)';
            const milestone = await executeQuery(query, [mid, userid, pid]);
            res.json(milestone);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Retrieve all tasks for a milestone
    app.get('/alltasks/:mid', async (req, res) => {
        try {
            const utype = req.session.user.UserType;
            const milestoneid = req.params.mid;
            let tasks;
            if (utype == 1) {
                tasks = await executeQuery('SELECT * FROM tasks WHERE milestoneid = ?', [milestoneid]);
            } else if (utype == 2) {
                const userid = req.session.user.UserID;
                tasks = await executeQuery('SELECT * FROM tasks WHERE milestoneid = ? AND assignedto = ?', [milestoneid, userid]);
            }
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Retrieve a task by ID
    app.get('/tasks/:tid', async (req, res) => {
        try {
            const utype = req.session.user.UserType;
            const { tid } = req.params;
            let task;
            if (utype == 1) {
                task = await executeQuery('SELECT * FROM tasks WHERE taskid = ?', [tid]);
            } else if (utype == 2) {
                const userid = req.session.user.UserID;
                task = await executeQuery('SELECT * FROM tasks WHERE taskid = ? AND assignedto = ?', [tid, userid]);
            }
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Retrieves all tasks assigned to a user
    app.get('/tasks/assignedto/:userid', async (req, res) => {
        try {
            const utype = req.session.user.UserType;
            const userid = utype == 1 ? req.params.userid : req.session.user.UserID;
            const tasks = await executeQuery('SELECT * FROM tasks WHERE assignedto = ?', [userid]);
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Search for users by username or email
    app.get('/api/users/search', async (req, res) => {
        try {
            const query = req.query.q;
            const users = await executeQuery('SELECT * FROM users WHERE username LIKE ? OR email LIKE ?', [`%${query}%`, `%${query}%`]);
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Retrieve all projects a user is assigned to or created by the user
    app.get('/userprojects', async (req, res) => {
        try {
            const userid = req.session.user.UserID;
            const utype = req.session.user.UserType;
            let projects;
            if (utype == 1) {
                const query = 'SELECT DISTINCT * FROM projects WHERE CreatedBy = ?';
                projects = await executeQuery(query, [userid]);
            } else if (utype == 2) {
                const query = `
                    SELECT DISTINCT p.*
                    FROM projects p
                    LEFT JOIN milestones m ON p.ProjectID = m.ProjectID
                    LEFT JOIN tasks t ON m.MilestoneID = t.MilestoneID
                    WHERE t.AssignedTo = ?`;
                projects = await executeQuery(query, [userid]);
            }
            res.json(projects);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Search for projects by name or description
    app.get('/projects/search', async (req, res) => {
        try {
            const query = req.query.q;
            const userid = req.session.user.UserID;
            const utype = req.session.user.UserType;
            let projects;
            if (utype == 1) {
                projects = await executeQuery('SELECT * FROM projects WHERE CreatedBy = ? AND (ProjectName LIKE ? OR description LIKE ?)', [userid, `%${query}%`, `%${query}%`]);
            } else if (utype == 2) {
                const qry = `
                    SELECT * FROM projects p 
                    JOIN milestones m ON p.projectid = m.projectid
                    JOIN tasks t ON t.milestoneid = m.milestoneid 
                    WHERE t.assignedto = ? 
                    AND (ProjectName LIKE ? OR description LIKE ?)`;
                projects = await executeQuery(qry, [userid, `%${query}%`, `%${query}%`]);
            }
            res.json(projects);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

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

    // Get all notifications
    app.get('/notifications', async (req, res) => {
        try {
            const userid = req.session.user.UserID;
            const query = `
                SELECT ns.*, n.message 
                FROM notificationssent ns
                JOIN notifications n ON ns.notn = n.notid
                WHERE ns.userid = ?`;
            const notifications = await executeQuery(query, [userid]);
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Get all unviewed notifications
    app.get('/notifications/unviewed', async (req, res) => {
        try {
            const userid = req.session.user.UserID;
            const query = `
                SELECT ns.*, n.message 
                FROM notificationssent ns
                JOIN notifications n ON ns.notn = n.notid
                WHERE ns.userid = ? AND ns.viewed = 0`;
            const notifications = await executeQuery(query, [userid]);
            if (notifications.length === 0) {
                res.status(404).send('No unviewed notifications found for this user');
            } else {
                res.json(notifications);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Get specific unviewed notification
    app.get('/notifications/unviewed/:notnid', async (req, res) => {
        try {
            const userid = req.session.user.UserID;
            const { notnid } = req.params;
            const query = `
                SELECT ns.*, n.message 
                FROM notificationssent ns
                JOIN notifications n ON ns.notn = n.notid
                WHERE ns.userid = ? AND ns.notnid = ? AND ns.viewed = 0`;
            const notifications = await executeQuery(query, [userid, notnid]);
            if (notifications.length === 0) {
                res.status(404).send('No unviewed notifications found for user with the specified ID');
            } else {
                res.json(notifications);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Get all completion proofs
    app.get('/completionproofs', async (req, res) => {
        try {
            const query = 'SELECT * FROM completionproofs';
            const results = await executeQuery(query);
            res.status(200).json(results);
        } catch (err) {
            console.error("Error fetching completion proofs:", err);
            res.status(500).json({ error: "Error fetching completion proofs" });
        }
    });

    // GET endpoint to fetch a completion proof by TaskID
    app.get('/completionproofs/:taskid', async (req, res) => {
        const { taskid } = req.params;
        
        try {
            const query = 'SELECT SubmissionAt, ProofFile FROM completionproofs WHERE TaskID = ?';
            const results = await executeQuery(query, [taskid]);
            
            if (results.length === 0) {
                res.status(404).json({ error: "No completion proof found for this TaskID" });
            } else {
                res.status(200).json(results[0]);
            }
        } catch (err) {
            console.error("Error fetching completion proof:", err);
            res.status(500).json({ error: "Error fetching completion proof" });
        }
    });

    // Get Overdue completed tasks by user ID
    app.get('/:userid/tasks/overdue-completed', async (req, res) => {
        const { userid } = req.params;
        const query = `
            SELECT *
            FROM tasks
            WHERE AssignedTo = ?
              AND Status = 'Completed'
              AND EndDate < CURDATE()
        `;

        try {
            const results = await executeQuery(query, [userid]);
            if (results.length === 0) {
                res.status(404).json({ error: `No overdue completed tasks found for user ID ${userid}` });
            } else {
                res.status(200).json(results);
            }
        } catch (err) {
            console.error("Error fetching overdue completed tasks:", err);
            res.status(500).json({ error: "Error fetching overdue completed tasks" });
        }
    });

    // Get Overdue incomplete tasks by user ID
    app.get('/:userid/tasks/overdue-incomplete', async (req, res) => {
        const { userid } = req.params;
        const query = `
            SELECT *
            FROM tasks
            WHERE AssignedTo = ?
              AND Status = 'In Progress'
              AND EndDate < CURDATE()
        `;

        try {
            const results = await executeQuery(query, [userid]);
            if (results.length === 0) {
                res.status(404).json({ error: `No overdue incomplete tasks found for user ID ${userid}` });
            } else {
                res.status(200).json(results);
            }
        } catch (err) {
            console.error("Error fetching overdue incomplete tasks:", err);
            res.status(500).json({ error: "Error fetching overdue incomplete tasks" });
        }
    });

    // Get Completed tasks by user ID
    app.get('/:userid/tasks/completed', async (req, res) => {
        const { userid } = req.params;
        const query = `
            SELECT *
            FROM tasks
            WHERE AssignedTo = ?
              AND Status = 'Completed'
        `;

        try {
            const results = await executeQuery(query, [userid]);
            if (results.length === 0) {
                res.status(404).json({ error: `No completed tasks found for user ID ${userid}` });
            } else {
                res.status(200).json(results);
            }
        } catch (err) {
            console.error("Error fetching completed tasks:", err);
            res.status(500).json({ error: "Error fetching completed tasks" });
        }
    });

    // Get Not Started tasks by user ID
    app.get('/:userid/tasks/notStarted', async (req, res) => {
        const { userid } = req.params;
        const query = `
            SELECT *
            FROM tasks
            WHERE AssignedTo = ?
              AND StartDate > CURDATE()
        `;

        try {
            const results = await executeQuery(query, [userid]);
            if (results.length === 0) {
                res.status(404).json({ error: `No not started tasks found for user ID ${userid}` });
            } else {
                res.status(200).json(results);
            }
        } catch (err) {
            console.error("Error fetching not started tasks:", err);
            res.status(500).json({ error: "Error fetching not started tasks" });
        }
    });

    // Get In Progress tasks by user ID
    app.get('/:userid/tasks/inprogress', async (req, res) => {
        const { userid } = req.params;
        const query = `
            SELECT *
            FROM tasks
            WHERE AssignedTo = ?
              AND StartDate <= CURDATE()
              AND EndDate >= CURDATE()
        `;

        try {
            const results = await executeQuery(query, [userid]);
            if (results.length === 0) {
                res.status(404).json({ error: `No in progress tasks found for user ID ${userid}` });
            } else {
                res.status(200).json(results);
            }
        } catch (err) {
            console.error("Error fetching in progress tasks:", err);
            res.status(500).json({ error: "Error fetching in progress tasks" });
        }
    });
};
