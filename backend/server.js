require('dotenv').config(); // Load .env

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const app = express();
const url = 'mongodb+srv://joseghm:J*maria200@cop4331.2zyjohl.mongodb.net/COP4331?retryWrites=true&w=majority&appName=COP4331';
const client = new MongoClient(url);
const PORT = process.env.PORT || 5001;
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Verification Middleware
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
}

// Routes
app.post('/api/login', async (req, res) => {
    const { Login, Password } = req.body;

    try {
        const db = client.db('COP4331');
        const user = await db.collection('Users').findOne({ Login, Password });

        if (!user) return res.status(400).json({ error: 'Invalid login or password' });

        // Create and sign token
        const payload = {
            id: user.UserID,
            FirstName: user.FirstName,
            LastName: user.LastName,
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });

        res.status(200).json({ token, ...payload, error: '' });
    } catch (err) {
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

app.post('/api/addcard', verifyToken, async (req, res) => {
    const { Card } = req.body;
    const newCard = { UserID: req.user.id, Card };

    try {
        const db = client.db('COP4331');
        await db.collection('Cards').insertOne(newCard);
        res.status(200).json({ error: '' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/searchcards', verifyToken, async (req, res) => {
    const { search } = req.body;
    const _search = search.trim();

    try {
        const db = client.db('COP4331');
        const results = await db.collection('Cards')
            .find({ UserID: req.user.id, Card: { $regex: _search + '.*' } })
            .toArray();

        const cards = results.map(r => r.Card);
        res.status(200).json({ results: cards, error: '' });
    } catch (e) {
        res.status(500).json({ results: [], error: e.message });
    }
});

// Connect to DB & Start Server
async function startServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

startServer();