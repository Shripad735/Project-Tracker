const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());
app.get('/',(req,res)=>{
    res.send('<h1>Hello! Welcome to server</h1>');
})

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'projectplanner'
});

db.connect(err => {
    if (err) {
      console.error('Error connecting to the database:');
      return;
    }
    console.log('Connected to the database');
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

//   Retrieves all milestones for a project
app.get('/api/milestones/project/:projectid', async (req, res) => {
    try {
      const projectid = req.params.projectid;
      const milestones = await executeQuery('SELECT * FROM milestones WHERE projectid = ?', [projectid]);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// Search for users by name or email
app.get('/api/users/search', async (req, res) => {
  try {
    const query = req.query.q;
    const users = await executeQuery('SELECT * FROM users WHERE name LIKE ? OR email LIKE ?', [`%${query}%`, `%${query}%`]);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Retrieve all projects a user is assigned to
app.get('/api/users/:id/projects', async (req, res) => {
  try {
    const userid = req.params.id;
    const projects = await executeQuery('SELECT * FROM projects WHERE userid = ?', [userid]);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for projects by name or description
app.get('/api/projects/search', async (req, res) => {
  try {
    const query = req.query.q;
    const projects = await executeQuery('SELECT * FROM projects WHERE name LIKE ? OR description LIKE ?', [`%${query}%`, `%${query}%`]);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Retrieve all milestones for a project
app.get('/api/projects/:id/milestones', async (req, res) => {
  try {
    const projectid = req.params.id;
    const milestones = await executeQuery('SELECT * FROM milestones WHERE projectid = ?', [projectid]);
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for tasks by name or description
app.get('/api/tasks/search', async (req, res) => {
  try {
    const query = req.query.q;
    const tasks = await executeQuery('SELECT * FROM tasks WHERE name LIKE ? OR description LIKE ?', [`%${query}%`, `%${query}%`]);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve all comments for a task 
app.get('/api/tasks/:id/comments', async (req, res) => {
  try {
    const taskid = req.params.id;
    const comments = await executeQuery('SELECT * FROM comments WHERE taskid = ?', [taskid]);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Milestone Management 
//  Search for milestones by name or description
app.get('/api/milestones/search', async (req, res) => {
  try {
    const query = req.query.q;
    const milestones = await executeQuery('SELECT * FROM milestones WHERE name LIKE ? OR description LIKE ?', [`%${query}%`, `%${query}%`]);
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve all tasks for a milestone 
app.get('/api/milestones/:id/tasks', async (req, res) => {
  try {
    const milestoneid = req.params.id;
    const tasks = await executeQuery('SELECT * FROM tasks WHERE milestoneid = ?', [milestoneid]);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// // index3


// | Route                             | Method | Description                                   |
// |-----------------------------------|--------|-----------------------------------------------|
// | `/api/tasks/assignedto/:userid`   | GET    | Retrieves all tasks assigned to a user        |
// | `/api/milestones/project/:projectid` | GET  | Retrieves all milestones for a project        |
// | `/api/users/search`               | GET    | Search for users by name or email             |
// | `/api/users/:id/projects`         | GET    | Retrieve all projects a user is assigned to   |
// | `/api/projects/search`            | GET    | Search for projects by name or description    |
// | `/api/projects/:id/milestones`    | GET    | Retrieve all milestones for a project         |
// | `/api/tasks/search`               | GET    | Search for tasks by name or description       |
// | `/api/tasks/:id/comments`         | GET    | Retrieve all comments for a task              |
// | `/api/milestones/search`          | GET    | Search for milestones by name or description  |
// | `/api/milestones/:id/tasks`       | GET    | Retrieve all tasks for a milestone            |




// index2:
// | Route               | Method | Description                          |
// |---------------------|--------|--------------------------------------|
// | `/`                 | GET    | Returns a welcome message            |
// | `/allusers`         | GET    | Retrieves all users                  |
// | `/users/:id`        | GET    | Retrieves a user by ID               |
// | `/allprojects`      | GET    | Retrieves all projects               |
// | `/projects/:id`     | GET    | Retrieves a project by ID            |
// | `/allmilestones/:id`| GET    | Retrieves all milestones for a project|
// | `/milestones/:pid/:mid` | GET | Retrieves a milestone by ID          |
// | `/alltasks/:mid`    | GET    | Retrieves all tasks for a milestone  |
// | `/tasks/:mid/:tid`  | GET    | Retrieves a task by ID               |


// index1 

// | Route                             | Method | Description                                   |
// |-----------------------------------|--------|-----------------------------------------------|
// | `/`                               | GET    | Returns a welcome message                     |
// | `/api/users`                      | GET    | Retrieves all users                           |
// | `/api/users/:id`                  | GET    | Retrieves a user by ID                        |
// | `/api/users`                      | POST   | Creates a new user                            |
// | `/api/users/:id`                  | PUT    | Updates a user                                |
// | `/api/users/:id`                  | DELETE | Deletes a user                                |
// | `/api/projects`                   | GET    | Retrieves all projects                        |
// | `/api/projects/:id`               | GET    | Retrieves a project by ID                     |
// | `/api/projects`                   | POST   | Creates a new project                         |
// | `/api/projects/:id`               | PUT    | Updates a project                             |
// | `/api/projects/:id`               | DELETE | Deletes a project                             |
// | `/api/milestones`                 | GET    | Retrieves all milestones                      |
// | `/api/milestones/:id`             | GET    | Retrieves a milestone by ID                   |
// | `/api/milestones`                 | POST   | Creates a new milestone                       |
// | `/api/milestones/:id`             | PUT    | Updates a milestone                           |
// | `/api/milestones/:id`             | DELETE | Deletes a milestone                           |
// | `/api/tasks`                      | GET    | Retrieves all tasks                           |
// | `/api/tasks/:id`                  | GET    | Retrieves a task by ID                        |
// | `/api/tasks`                      | POST   | Creates a new task                            |
// | `/api/tasks/:id`                  | PUT    | Updates a task                                |
// | `/api/tasks/:id`                  | DELETE | Deletes a task                                |
// | `/api/assignments`                | GET    | Retrieves all assignments                     |
// | `/api/assignments/:id`            | GET    | Retrieves an assignment by ID                 |
// | `/api/assignments`                | POST   | Creates a new assignment                      |
// | `/api/assignments/:id`            | PUT    | Updates an assignment                         |
// | `/api/assignments/:id`            | DELETE | Deletes an assignment                         |
// | `/api/completionproofs`           | GET    | Retrieves all completion proofs               |
// | `/api/completionproofs/:id`       | GET    | Retrieves a completion proof by ID            |
// | `/api/completionproofs`           | POST   | Creates a new completion proof                |
// | `/api/completionproofs/:id`       | PUT    | Updates a completion proof                    |
// | `/api/completionproofs/:id`       | DELETE | Deletes a completion proof                    |
// | `/api/notifications`              | GET    | Retrieves all notifications                   |
// | `/api/notifications/:id`          | GET    | Retrieves a notification by ID                |
// | `/api/notifications`              | POST   | Creates a new notification                    |
// | `/api/notifications/:id`          | PUT    | Updates a notification                        |
// | `/api/notifications/:id`          | DELETE | Deletes a notification                        |