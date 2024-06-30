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

// GET REQUESTS

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

// POST REQUESTS

// Add new usertype
app.post('/usertypes', (req, res) => {
  const { usertype } = req.body;

  if (!usertype) {
      res.status(400).send('Usertype is required!');
      return;
  }

  const query = 'INSERT INTO usertypes (usertypeid, usertype) VALUES (NULL, ?)';
  db.query(query, [usertype], (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(201).json({ id: results.insertId, usertype });
  });
});

// Add new user
app.post('/users', (req, res) => {
  const { username, name, email, password, usertype } = req.body;

  if (!username || !name || !email || !password || !usertype) {
      res.status(400).send('Username, name, email, password & usertype all are required!');
      return;
  }

  const query = 'INSERT INTO users (userid, username, name, email, password, usertype) VALUES (NULL, ?, ?, ?, ?, ?)';
  db.query(query, [username, name, email, password, usertype], (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(201).json({ id: results.insertId, name, email });
  });
});

// Add new project
app.post('/projects', (req, res) => {
  const { projectname, description, startdate, enddate, created_by, status } = req.body;

  if (!projectname || !startdate || !enddate || !created_by) {
      res.status(400).send('Project name, start date, end date & creator ID all are required!');
      return;
  }

  const query = 'INSERT INTO projects (projectid, projectname, description, startdate, enddate, created_by, status) VALUES (NULL, ?, ?, ?, ?, ?, ?)';
  db.query(query, [projectname, description, startdate, enddate, created_by, status], (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(201).json({ id: results.insertId, projectname, created_by });
  });
});

// Add new milestone
app.post('/milestones', (req, res) => {
  const { ProjectID, MilestoneName, Description, StartDate, DueDate, Status } = req.body;

  if (!ProjectID || !MilestoneName || !StartDate || !DueDate) {
      res.status(400).send('Milestone name, reference project, start date, end date all are required!');
      return;
  }

  const query = 'INSERT INTO milestones (milestoneid, projectid, milestonename, description, startdate, duedate, status) VALUES (NULL, ?, ?, ?, ?, ?, ?)';
  db.query(query, [ProjectID, MilestoneName, Description, StartDate, DueDate, Status], (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(201).json({ id: results.insertId, MilestoneName, Status });
  });
});

// Add new tasks
app.post('/tasks', (req, res) => {
  const { MilestoneID, TaskName, Description, StartDate, EndDate, AssignedTo, Status } = req.body;

  if (!MilestoneID || !TaskName || !StartDate || !EndDate || !AssignedTo) {
      res.status(400).send('Task name, reference milestone, start date, end date and assigned user all are required!');
      return;
  }

  const query = 'INSERT INTO tasks (taskid, milestoneid, taskname, description, startdate, enddate, assignedto, status) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [MilestoneID, TaskName, Description, StartDate, EndDate, AssignedTo, Status], (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(201).json({ id: results.insertId, TaskName, AssignedTo, Status });
  });
});

// DELETE REQUESTS

// Delete existing user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).send('User ID is required');
    return;
  }

  const query = 'DELETE FROM users WHERE userid = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.status(200).send('User deleted successfully');
  });
});

// Delete existing task
app.delete('/tasks/:tid', (req, res) => {
  const { tid } = req.params;

  if (!tid) {
    res.status(400).send('Task ID is required');
    return;
  }

  const query = 'DELETE FROM tasks WHERE taskid = ?';
  db.query(query, [tid], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Task not found');
      return;
    }
    res.status(200).send('Task deleted successfully');
  });
});

// Delete existing milestone
app.delete('/milestones/:mid', (req, res) => {
  const { mid } = req.params;

  if (!mid) {
    res.status(400).send('Milestone ID is required');
    return;
  }

  const query = 'DELETE FROM milestones WHERE milestoneid = ?';
  db.query(query, [mid], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Milestone not found');
      return;
    }
    res.status(200).send('Milestone deleted successfully');
  });
});

// Delete existing project
app.delete('/projects/:pid', (req, res) => {
  const { pid } = req.params;

  if (!pid) {
    res.status(400).send('Project ID is required');
    return;
  }

  const query = 'DELETE FROM projects WHERE projectid = ?';
  db.query(query, [pid], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Project not found');
      return;
    }
    res.status(200).send('Project deleted successfully');
  });
});

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
