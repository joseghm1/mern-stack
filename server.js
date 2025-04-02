const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const url = 'mongodb+srv://joseghm:J*maria200@cop4331.2zyjohl.mongodb.net/COP4331?retryWrites=true&w=majority&appName=COP4331';
const client = new MongoClient(url);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

// Card list (optional)
const cardList = [
    'Roy Campanella', 'Paul Molitor', 'Tony Gwynn', 'Dennis Eckersley', 'Reggie Jackson',
    'Gaylord Perry', 'Buck Leonard', 'Rollie Fingers', 'Charlie Gehringer', 'Wade Boggs',
    'Carl Hubbell', 'Dave Winfield', 'Jackie Robinson', 'Ken Griffey, Jr.', 'Al Simmons',
    'ChuckA Klein', 'Mel Ott', 'Mark McGwire', 'Nolan Ryan', 'Ralph Kiner', 'Yogi Berra',
    'Goose Goslin', 'Greg Maddux', 'Frankie Frisch', 'Ernie Banks', 'Ozzie Smith',
    'Hank Greenberg', 'Kirby Puckett', 'Bob Feller', 'Dizzy Dean', 'Joe Jackson',
    'Sam Crawford', 'Barry Bonds', 'Duke Snider', 'George Sisler', 'Ed Walsh', 'Tom Seaver',
    'Willie Stargell', 'Bob Gibson', 'Brooks Robinson', 'Steve Carlton', 'Joe Medwick',
    'Nap Lajoie', 'Cal Ripken, Jr.', 'Mike Schmidt', 'Eddie Murray', 'Tris Speaker',
    'Al Kaline', 'Sandy Koufax', 'Willie Keeler', 'Pete Rose', 'Robin Roberts',
    'Eddie Collins', 'Lefty Gomez', 'Lefty Grove', 'Carl Yastrzemski', 'Frank Robinson',
    'Juan Marichal', 'Warren Spahn', 'Pie Traynor', 'Roberto Clemente', 'Harmon Killebrew',
    'Satchel Paige', 'Eddie Plank', 'Josh Gibson', 'Oscar Charleston', 'Mickey Mantle',
    'Cool Papa Bell', 'Johnny Bench', 'Mickey Cochrane', 'Jimmie Foxx', 'Jim Palmer',
    'Cy Young', 'Eddie Mathews', 'Honus Wagner', 'Paul Waner', 'Grover Alexander',
    'Rod Carew', 'Joe DiMaggio', 'Joe Morgan', 'Stan Musial', 'Bill Terry', 'Rogers Hornsby',
    'Lou Brock', 'Ted Williams', 'Bill Dickey', 'Christy Mathewson', 'Willie McCovey',
    'Lou Gehrig', 'George Brett', 'Hank Aaron', 'Harry Heilmann', 'Walter Johnson',
    'Roger Clemens', 'Ty Cobb', 'Whitey Ford', 'Willie Mays', 'Rickey Henderson', 'Babe Ruth'
];

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

// Start server with MongoDB connection
async function startServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('COP4331');
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        app.listen(5001, () => {
            console.log('Server running on port 5001');
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

startServer();