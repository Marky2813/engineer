//The frontend and the backend for this project is both hosted on port 3000, launch the server and enjoy the game. 
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


require('dotenv').config();
const { Pool } = require('pg');
require('dotenv').config();


//SQL is sturctured query language used to communicate with a relational databse. 
//PortgresSQL is a relational database management system
//neon db is a serverless cloud platform for postgressql
//pg is a library used to connect and run queries on a postgressql 

let quiz = [
];

let totalCorrect = 0;

let currentQuestion = {};


const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

app.get('/', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM countries');
    quiz = rows || 'no data found';
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("index.ejs", { question: currentQuestion });
  } catch (err) {
    console.error('database query failed', err);
    res.status(500).json({ err })
  } finally {
    client?.release();
  }
})

app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log("listening to port 3000!")
})