require('dotenv').config();
const massive = require('massive');
const express = require('express');
const session = require('express-session');

//controllers
const authController = require('./controllers/authController');
const treasureController = require('./controllers/treasureController');

//middleware
const auth = require('./middleware/authMiddleware');

const {CONNECTION_STRING, SESSION_SECRET} = process.env;

massive(CONNECTION_STRING)
.then((db) => {
    app.set('db', db);
});

const app = express();

const PORT = 4000;

app.use(session(
    {
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

app.use(express.json());

//auth
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.get('/auth/logout', auth.usersOnly, authController.logout);

//treasure
app.get('/api/treasure/dragon', treasureController.dragonTreasure);
app.get('/api/treasure/user', treasureController.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureController.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureController.getAllTreasure);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});