const authMiddleware = require('../authMiddleware');
var md5 = require('md5');

module.exports = (app, executeQuery) => {
    // Apply authMiddleware to all POST routes except for the specified ones
    app.use((req, res, next) => {
        if (req.path === '/register') {
            return next();
        } else {
            return authMiddleware(req, res, next);
        }
    });

    // User registration route (no auth required)
    app.post('/register', async (req, res) => {
        const { username, email, password, name, usertype } = req.body;

        if (!username || !email || !password || !name || !usertype) {
            res.status(400).send('Username, password, email, name and usertypeid are all required!');
            return;
        }

        const query = 'INSERT INTO users (userid, username, email, password, name, usertype) VALUES (NULL, ?, ?, ?, ?, ?)';

        try {
            const results = await executeQuery(query, [username, email, md5(password), name, usertype]);
            res.status(201).json({ id: results.insertId, email });
        } catch (err) {
            res.status(500).send(err);
        }
    });

    // Create a new project (auth required)
    app.post('/projects', async (req, res) => {
        const utype = req.session.user.UserType;
        if (utype != 1) {
            res.status(401).json({ message: "No rights to create projects" });
            return;
        }
        const uid = req.session.user.UserID;
        const { projectname, description, startdate, enddate } = req.body;

        if (!projectname || !startdate || !enddate) {
            res.status(400).send('Project name, startdate, enddate are all required!');
            return;
        }

        const qry = `INSERT INTO projects (projectid, projectname, description, startdate, enddate, createdby, status)
            VALUES (NULL, ?, ?, ?, ?, ?, 'Not Started')`;

        try {
            const result = await executeQuery(qry, [projectname, description, startdate, enddate, uid]);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Create a new milestone (auth required)
    app.post('/milestones', async (req, res) => {
        const utype = req.session.user.UserType;
        if (utype != 1) {
            res.status(401).json({ message: "No rights to create milestone" });
            return;
        }
        const { projectid, seq, milestonename, description, startdate, enddate } = req.body;

        if (!projectid || !milestonename || !startdate || !enddate) {
            res.status(400).send('ProjectID, Milestone Name, Startdate, Enddate all are required!');
            return;
        }
        try {
            const qry = `INSERT INTO milestones (milestoneid, projectid, seq, milestonename, description, startdate, enddate, status) 
                VALUES (NULL, ?, ?, ?, ?, ?, ?, 'Not Started')`;
            const result = await executeQuery(qry, [projectid, seq, milestonename, description, startdate, enddate]);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Create a new task (auth required)
    app.post('/tasks', async (req, res) => {
        const utype = req.session.user.UserType;
        if (utype != 1) {
            res.status(401).json({ message: "No rights to create task" });
            return;
        }

        const { milestoneid, seq, taskname, description, assignedto, startdate, enddate } = req.body;

        if (!milestoneid || !taskname || !assignedto || !startdate || !enddate) {
            res.status(400).send('MilestoneID, Task Name, Assigned User, Startdate, Enddate all are required!');
            return;
        }
        try {
            const qry = `INSERT INTO tasks (taskid, milestoneid, seq, taskname, description, assignedto, startdate, enddate, status) 
                VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, 'Not Started')`;
            const result = await executeQuery(qry, [milestoneid, seq, taskname, description, assignedto, startdate, enddate]);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
