const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'project_tracker',
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Helper function
async function executeQuery(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

app.get('/', (req, res) => {
    res.send('Welcome to Project Tracker API');
    }
);

// Users Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await executeQuery('SELECT * FROM Users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const [user] = await executeQuery('SELECT * FROM Users WHERE UserID = ?', [req.params.id]);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { Username, Password, Email, UserTypeID } = req.body;
    const result = await executeQuery(
      'INSERT INTO Users (Username, Password, Email, UserTypeID) VALUES (?, ?, ?, ?)',
      [Username, Password, Email, UserTypeID]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { Username, Password, Email, UserTypeID } = req.body;
    await executeQuery(
      'UPDATE Users SET Username = ?, Password = ?, Email = ?, UserTypeID = ? WHERE UserID = ?',
      [Username, Password, Email, UserTypeID, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM Users WHERE UserID = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Projects Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await executeQuery('SELECT * FROM Projects');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const [project] = await executeQuery('SELECT * FROM Projects WHERE ProjectID = ?', [req.params.id]);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { ProjectName, Description, StartDate, EndDate, Status } = req.body;
    const result = await executeQuery(
      'INSERT INTO Projects (ProjectName, Description, StartDate, EndDate, Status) VALUES (?, ?, ?, ?, ?)',
      [ProjectName, Description, StartDate, EndDate, Status]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { ProjectName, Description, StartDate, EndDate, Status } = req.body;
    await executeQuery(
      'UPDATE Projects SET ProjectName = ?, Description = ?, StartDate = ?, EndDate = ?, Status = ? WHERE ProjectID = ?',
      [ProjectName, Description, StartDate, EndDate, Status, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM Projects WHERE ProjectID = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Milestones Routes
app.get('/api/milestones', async (req, res) => {
  try {
    const milestones = await executeQuery('SELECT * FROM Milestones');
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/milestones/:id', async (req, res) => {
  try {
    const [milestone] = await executeQuery('SELECT * FROM Milestones WHERE MilestoneID = ?', [req.params.id]);
    if (milestone) {
      res.json(milestone);
    } else {
      res.status(404).json({ message: 'Milestone not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/milestones', async (req, res) => {
  try {
    const { ProjectID, MilestoneName, Description, DueDate } = req.body;
    const result = await executeQuery(
      'INSERT INTO Milestones (ProjectID, MilestoneName, Description, DueDate) VALUES (?, ?, ?, ?)',
      [ProjectID, MilestoneName, Description, DueDate]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/milestones/:id', async (req, res) => {
  try {
    const { ProjectID, MilestoneName, Description, DueDate } = req.body;
    await executeQuery(
      'UPDATE Milestones SET ProjectID = ?, MilestoneName = ?, Description = ?, DueDate = ? WHERE MilestoneID = ?',
      [ProjectID, MilestoneName, Description, DueDate, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/milestones/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM Milestones WHERE MilestoneID = ?', [req.params.id]);
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tasks Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await executeQuery('SELECT * FROM Tasks');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const [task] = await executeQuery('SELECT * FROM Tasks WHERE TaskID = ?', [req.params.id]);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { ProjectID, MilestoneID, TaskName, Description, AssignedTo, StartDate, EndDate, Status } = req.body;
    const result = await executeQuery(
      'INSERT INTO Tasks (ProjectID, MilestoneID, TaskName, Description, AssignedTo, StartDate, EndDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [ProjectID, MilestoneID, TaskName, Description, AssignedTo, StartDate, EndDate, Status]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { ProjectID, MilestoneID, TaskName, Description, AssignedTo, StartDate, EndDate, Status } = req.body;
    await executeQuery(
      'UPDATE Tasks SET ProjectID = ?, MilestoneID = ?, TaskName = ?, Description = ?, AssignedTo = ?, StartDate = ?, EndDate = ?, Status = ? WHERE TaskID = ?',
      [ProjectID, MilestoneID, TaskName, Description, AssignedTo, StartDate, EndDate, Status, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM Tasks WHERE TaskID = ?', [req.params.id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assignments Routes

app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await executeQuery('SELECT * FROM Assignments');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/assignments/:id', async (req, res) => {
  try {
    const [assignment] = await executeQuery('SELECT * FROM Assignments WHERE AssignmentID = ?', [req.params.id]);
    if (assignment) {
      res.json(assignment);
    } else {
      res.status(404).json({ message: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/assignments', async (req, res) => {
  try {
    const { ProjectID, TaskID, UserID, AssignedDate } = req.body;
    const result = await executeQuery(
      'INSERT INTO Assignments (ProjectID, TaskID, UserID, AssignedDate) VALUES (?, ?, ?, ?)',
      [ProjectID, TaskID, UserID, AssignedDate]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/assignments/:id', async (req, res) => {
  try {
    const { ProjectID, TaskID, UserID, AssignedDate } = req.body;
    await executeQuery(
      'UPDATE Assignments SET ProjectID = ?, TaskID = ?, UserID = ?, AssignedDate = ? WHERE AssignmentID = ?',
      [ProjectID, TaskID, UserID, AssignedDate, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/assignments/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM Assignments WHERE AssignmentID = ?', [req.params.id]);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CompletionProofs Routes

app.get('/api/completionproofs', async (req, res) => {
  try {
    const proofs = await executeQuery('SELECT * FROM CompletionProofs');
    res.json(proofs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/completionproofs/:id', async (req, res) => {
  try {
    const [proof] = await executeQuery('SELECT * FROM CompletionProofs WHERE ProofID = ?', [req.params.id]);
    if (proof) {
      res.json(proof);
    } else {
      res.status(404).json({ message: 'Completion proof not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/completionproofs', async (req, res) => {
  try {
    const { TaskID, SubmittedBy, SubmissionDate, ProofFile, Status, VerifiedBy } = req.body;
    const result = await executeQuery(
      'INSERT INTO CompletionProofs (TaskID, SubmittedBy, SubmissionDate, ProofFile, Status, VerifiedBy) VALUES (?, ?, ?, ?, ?, ?)',
      [TaskID, SubmittedBy, SubmissionDate, ProofFile, Status, VerifiedBy]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/completionproofs/:id', async (req, res) => {
  try {
    const { TaskID, SubmittedBy, SubmissionDate, ProofFile, Status, VerifiedBy } = req.body;
    await executeQuery(
      'UPDATE CompletionProofs SET TaskID = ?, SubmittedBy = ?, SubmissionDate = ?, ProofFile = ?, Status = ?, VerifiedBy = ? WHERE ProofID = ?',
      [TaskID, SubmittedBy, SubmissionDate, ProofFile, Status, VerifiedBy, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/completionproofs/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM CompletionProofs WHERE ProofID = ?', [req.params.id]);
    res.json({ message: 'Completion proof deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notifications Routes

app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await executeQuery('SELECT * FROM Notifications');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/notifications/:id', async (req, res) => {
  try {
    const [notification] = await executeQuery('SELECT * FROM Notifications WHERE NotificationID = ?', [req.params.id]);
    if (notification) {
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const { UserID, ProjectID, TaskID, Message, NotificationStatus } = req.body;
    const result = await executeQuery(
      'INSERT INTO Notifications (UserID, ProjectID, TaskID, Message, NotificationStatus) VALUES (?, ?, ?, ?, ?)',
      [UserID, ProjectID, TaskID, Message, NotificationStatus]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/notifications/:id', async (req, res) => {
  try {
    const { UserID, ProjectID, TaskID, Message, NotificationStatus } = req.body;
    await executeQuery(
      'UPDATE Notifications SET UserID = ?, ProjectID = ?, TaskID = ?, Message = ?, NotificationStatus = ? WHERE NotificationID = ?',
      [UserID, ProjectID, TaskID, Message, NotificationStatus, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/notifications/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM Notifications WHERE NotificationID = ?', [req.params.id]);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} url = http://localhost:${PORT}`);
});