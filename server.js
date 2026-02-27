const express = require('express');
const Datastore = require('nedb-promises');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const auth = require('./middleware/auth'); // Ensure this file exists!

const app = express();
const PORT = 3000;
const SECRET = "super_secret_key_123";

// --- Database Configuration ---
// NeDB creates local files for persistence, satisfying the DB schema requirement.
const db = {};
db.users = Datastore.create({ filename: './users.db', autoload: true });
db.notes = Datastore.create({ filename: './notes.db', autoload: true });

// Ensure usernames are unique
db.users.ensureIndex({ fieldName: 'username', unique: true });

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// --- Authentication APIs (v1) ---

/**
 * @route   POST /api/v1/register
 * @desc    Register a new user with hashed password
 */
app.post('/api/v1/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const hashedPw = await bcrypt.hash(password, 10);
        const newUser = await db.users.insert({ 
            username, 
            password: hashedPw, 
            role: role || 'user' 
        });

        res.status(201).json({ message: "User created", userId: newUser._id });
    } catch (err) {
        res.status(400).json({ error: "Username already exists" });
    }
});

/**
 * @route   POST /api/v1/login
 * @desc    Login and return JWT
 */
app.post('/api/v1/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.users.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role, username: user.username });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// --- Protected CRUD APIs (v1) ---

/**
 * @route   GET /api/v1/notes
 * @desc    Get all notes (Admins see all, Users see theirs)
 */
app.get('/api/v1/notes', auth(['user', 'admin']), async (req, res) => {
    try {
        let notes;
        if (req.user.role === 'admin') {
            notes = await db.notes.find({});
        } else {
            notes = await db.notes.find({ userId: req.user.id });
        }
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});

/**
 * @route   POST /api/v1/notes
 * @desc    Create a new note
 */
app.post('/api/v1/notes', auth(['user', 'admin']), async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await db.notes.insert({
            title,
            content,
            userId: req.user.id,
            createdAt: new Date()
        });
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ error: "Failed to create note" });
    }
});

// Global Error Handler for better API design
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`
🚀 Server running on http://localhost:${PORT}
📁 Database files: users.db, notes.db
🔒 Auth: JWT enabled
    `);
});
