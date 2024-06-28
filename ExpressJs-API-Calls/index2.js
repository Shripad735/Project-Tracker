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

app.get('/allusers', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(results);
    });
});

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

app.get('/allprojects', (req, res) => {
    db.query('SELECT * FROM projects', (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(results);
    });
});

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

app.get('/allmilestones/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM milestones WHERE projectid = ?', [id], (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.length === 0) {
        res.status(404).send('No milestones exist!');
        return;
      }
      res.json(results[0]);
    });
});

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

app.get('/alltasks/:mid/', (req, res) => {
    const { mid} = req.params;
    db.query('SELECT * FROM tasks WHERE milestoneid = ?', [mid], (err, results) => {
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

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});