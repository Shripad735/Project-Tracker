module.exports = (app, executeQuery) => {

// Update user information
app.put('/users/:userid', async (req, res) => {
    const UserID = req.session.user.UserID;
    const { Username, Email, Password, Name, UserType } = req.body;

    // Validate required fields
    if (!Username || !Email || !Password || !UserType || !Name) {
        return res.status(400).send('Username, email, password, usertype and name are all required!');
    }

    const query = 'UPDATE users SET username=?, password=?, email=?, usertype=?, name=? WHERE userid=?';

    try {
        const result = await executeQuery(query, [Username, md5(Password), Email, UserType, Name, UserID]);

        // Check if any rows were affected (i.e., if the user was found and updated)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).send(err);
    }
});

// Update task information
app.put('/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const { description, assignedTo } = req.body;

    // Validate required fields
    if (!description || !assignedTo) {
        return res.status(400).send('Description and assignedTo are required fields!');
    }

    const query = `
        UPDATE tasks
        SET description = ?, assignedTo = ?
        WHERE taskid = ?
    `;

    try {
        const result = await executeQuery(query, [description, assignedTo, taskId]);

        // Check if any rows were affected (i.e., if the task was found and updated)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task updated successfully' });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update project information
app.put('/projects/:projectId', async (req, res) => {
    const projectId = req.params.projectId;
    const { projectname, description, startdate, enddate } = req.body;

    // Validate required fields
    if (!projectname || !description || !startdate || !enddate) {
        return res.status(400).send('Project name, description, start date, and end date are required fields!');
    }

    const query = `
        UPDATE projects
        SET projectname=?, description=?, startdate=?, enddate=?
        WHERE projectid=?
    `;

    try {
        const result = await executeQuery(query, [projectname, description, startdate, enddate, projectId]);

        // Check if any rows were affected (i.e., if the project was found and updated)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully' });
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ error: err.message });
    }
});


    // Update all notifications sent to a user to 'viewed'
app.put('/notifications/:userid', async (req, res) => {
    const { userid } = req.params;

    const query = `
        UPDATE notificationssent
        SET viewed = 1
        WHERE userid = ? and viewed!=1
    `;

    try {
        const result = await executeQuery(query, [userid]);

        // Check if any rows were affected (i.e., if there were notifications to update)
        if (result.affectedRows === 0) {
            return res.status(404).send('No notifications found for this user');
        }

        res.status(200).send('Notification status updated to viewed');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a particular notification sent to a user to 'viewed'
app.put('/notifications/:userid/:notnid', async (req, res) => {
    const { userid, notnid } = req.params;

    const query = `
        UPDATE notificationssent
        SET viewed = 1
        WHERE userid = ? AND notnid = ? AND viewed!=1
    `;

    try {
        const result = await executeQuery(query, [userid, notnid]);

        // Check if any rows were affected (i.e., if the notification was found and updated)
        if (result.affectedRows === 0) {
            return res.status(404).send('No notification found for this user with the specified notification ID');
        }

        res.status(200).send('Notification status updated to viewed');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve task completion   Error in this 
app.put('/completionproofs/:taskid/approve', async (req, res) => {
    const { taskid } = req.params;

    const updateQuery = `
        UPDATE completionproofs
        SET Status = 'Approved'
        WHERE TaskID = ? AND Status = 'Pending'
    `;

    try {
        const result = await executeQuery(updateQuery, [taskid]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `No completion proof found for TaskID ${taskid} with 'Pending' status` });
        }

        res.status(200).json({ message: "Completion proof status updated to Approved" });
    } catch (err) {
        console.error("Error updating completion proof status:", err);
        res.status(500).json({ error: "Error updating completion proof status" });
    }
});

// Reject task completion
app.put('/completionproofs/:taskid/reject', async (req, res) => {
    const { taskid } = req.params;

    const updateQuery = `
        UPDATE completionproofs
        SET Status = 'Rejected'
        WHERE TaskID = ? AND Status = 'Pending'
    `;

    try {
        const result = await executeQuery(updateQuery, [taskid]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `No completion proof found for TaskID ${taskid} with 'Pending' status` });
        }

        res.status(200).json({ message: "Completion proof status updated to Rejected" });
    } catch (err) {
        console.error("Error updating completion proof status:", err);
        res.status(500).json({ error: "Error updating completion proof status" });
    }
});


};
