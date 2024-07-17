module.exports = (app, executeQuery) => {
    // Delete a user by ID
    app.delete('/user/:id', async (req, res) => {
        const userId = req.params.id;

        try {
            // Execute the delete query
            const result = await executeQuery('DELETE FROM users WHERE userid = ?', [userId]);

            // Check if any rows were affected (i.e., if a user was deleted)
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Delete a project by ID
    app.delete('/projects/:pid', async (req, res) => {
        const { pid } = req.params;

        try {
            // Execute the delete query
            const result = await executeQuery('DELETE FROM projects WHERE projectid = ?', [pid]);

            // Check if any rows were affected (i.e., if a project was deleted)
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Project not found' });
            }

            res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
