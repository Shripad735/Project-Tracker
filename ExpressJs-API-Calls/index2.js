const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());
app.get('/',(req,res)=>{
    res.send('<h1>Hello! Welcome to server</h1>');
});

// Establish connectivity with database
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

// Display all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(results);
    });
});

// Display all task makers
app.get('/task-makers', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Users WHERE UserType = (SELECT UserTypeID FROM UserTypes WHERE UserType = \'Task maker\');', [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).send('No task makers exist!');
      return;
    }
    res.json(results);
  });
});

// Display all task completers
app.get('/task-completers', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Users WHERE UserType = (SELECT UserTypeID FROM UserTypes WHERE UserType = \'Task completer\');', [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).send('No task completers exist!');
      return;
    }
    res.json(results);
  });
});

// Display user with specific ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE userid = ?', [id], (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.length === 0) {
        res.status(404).send('User not found!');
        return;
      }
      res.json(results[0]);
    });
});

// Display all projects
app.get('/projects', (req, res) => {
    db.query('SELECT * FROM projects', (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(results);
    });
});

// Display a specific project with Project ID
app.get('/projects/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM projects WHERE projectid = ?', [id], (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.length === 0) {
        res.status(404).send('Project not found!');
        return;
      }
      res.json(results[0]);
    });
});

// Display all milestones in a specific project with ID
app.get('/milestones/:pid', (req, res) => {
    const { pid } = req.params;
    db.query('SELECT * FROM milestones WHERE projectid = ?', [pid], (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.length === 0) {
        res.status(404).send('No milestones exist!');
        return;
      }
      res.json(results);
    });
});

// Display specific milestone in a project with milestone & project ID 
app.get('/milestones/:pid/:mid', (req, res) => {
    const { pid, mid} = req.params;
    db.query('SELECT * FROM milestones WHERE projectid = ? and milestoneid = ?', [pid,mid], (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.length === 0) {
        res.status(404).send('Milestone not found!');
        return;
      }
      res.json(results[0]);
    });
});

// Display all tasks within a specific milestone
app.get('/tasks/:mid/', (req, res) => {
    const { mid} = req.params;
    db.query('SELECT * FROM tasks WHERE milestoneid = ?', [mid], (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.length === 0) {
        res.status(404).send('No tasks exist!');
        return;
      }
      res.json(results);
    });
});

// Display specific task within a specific milestone with milestone & task ID
app.get('/tasks/:mid/:tid', (req, res) => {
    const { mid, tid} = req.params;
    db.query('SELECT * FROM tasks WHERE milestoneid = ? and taskid = ?', [mid,tid], (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.length === 0) {
        res.status(404).send('Task not found!');
        return;
      }
      res.json(results[0]);
    });
});

// Display all tasks assigned to a specific user
app.get('/tasksof/:uid', (req, res) => {
  const { uid } = req.params;
  db.query('SELECT t.assignedto,p.projectid,t.taskid,t.taskname,t.description,t.startdate,t.enddate,t.status FROM tasks t inner join milestones m on t.milestoneid=m.milestoneid inner join projects p on p.projectid=m.projectid WHERE t.assignedto = ?', [uid], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).send('No any tasks assigned!');
      return;
    }
    res.json(results);
  });
});

// Display all tasks within a project assigned to a specific user
app.get('/tasksof/:uid/:pid', (req, res) => {
  const { uid, pid} = req.params;
  db.query('SELECT t.assignedto,p.projectid,t.taskid,t.taskname,t.description,t.startdate,t.enddate,t.status FROM tasks t inner join milestones m on t.milestoneid=m.milestoneid inner join projects p on p.projectid=m.projectid WHERE t.assignedto = ? and p.projectid = ?', [uid,pid], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).send('No any tasks assigned!');
      return;
    }
    res.json(results);
  });
});

// Display all projects created by a specific user
app.get('/projectsby/:uid/', (req, res) => {
  const { uid} = req.params;
  db.query('SELECT * from projects where created_by = ?', [uid], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).send('No any projects created!');
      return;
    }
    res.json(results);
  });
});

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
