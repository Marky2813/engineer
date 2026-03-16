//  Create a middleware that logs all incoming requests to the console.

const express = require('express');
const app = express();


// app.use(express.json());
function logRequests(req, res, next) {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next(); 
}

app.use(logRequests);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello, world!' });
});

module.exports = app;

//very cool, learnt a lot about how to reverse engineer from the tests. good stuff. one step further in becoming a cracked engineer