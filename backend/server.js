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





// Routes
app.post('/api/addcard', async (req, res, next) => {
    const { UserID, Card } = req.body;
    const newCard = { UserID, Card };
    let error = '';

    try {
        const db = client.db('COP4331');
        await db.collection('Cards').insertOne(newCard);
        cardList.push(Card);
    } catch (e) {
        error = e.toString();
    }

    res.status(200).json({ error });
});

app.post('/api/login', async (req, res, next) => {
    let error = '';
    const { Login, Password } = req.body;

    let id = '-1';
    let FirstName = '';
    let LastName = '';

    if (!Login || !Password || Login.trim() === '' || Password.trim() === '') {
        error = 'Login and password are required';
    } else {
        try {
            const db = client.db('COP4331');
            console.log('Querying Users collection with:', { Login, Password });
            const user = await db.collection('Users').findOne({ Login, Password }); // Changed to 'Users'
            console.log('Found user:', user);

            if (user) {
                id = user.UserID;
                FirstName = user.FirstName;
                LastName = user.LastName;
            } else {
                error = 'Invalid login or password';
            }
        } catch (e) {
            error = 'Database error: ' + e.message;
            console.error('Database error:', e);
        }
    }

    res.status(200).json({ id, FirstName, LastName, error });
});

app.post('/api/searchcards', async (req, res, next) => {
    const { UserID, search } = req.body;
    let error = '';
    const _search = search.trim();

    try {
        const db = client.db('COP4331');
        const results = await db.collection('Cards')
            .find({ UserID, Card: { $regex: _search + '.*' } })
            .toArray();
        const _ret = results.map(result => result.Card);
        res.status(200).json({ results: _ret, error });
    } catch (e) {
        error = e.toString();
        res.status(200).json({ results: [], error });
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