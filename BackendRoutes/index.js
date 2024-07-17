const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');
const authMiddleware = require('./authMiddleware'); // Import the auth middleware
var md5 = require('md5');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Assuming your HTML files are in a 'public' directory

// Configure session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'projectplanner'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Execute Query Function
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

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    try {
        const users = await executeQuery(query, [username, md5(password)]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a session
        req.session.user = users[0];
        res.status(200).json({ message: 'Login successful', username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/createproject', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'createproject.html'));
});


// Serve dashboard.html
app.get('/dashboard', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Apply authMiddleware to all GET routes
app.use(authMiddleware);

// Routes
require('./routes/getRoutes')(app, executeQuery);
require('./routes/postRoutes')(app, executeQuery);
require('./routes/putRoutes')(app, executeQuery);
require('./routes/deleteRoutes')(app, executeQuery);

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
