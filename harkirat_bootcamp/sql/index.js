
const express = require('express'); 
const app = express(); 
const port = 3000; 

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static("public"));


require('dotenv').config(); 
const { Pool } = require('pg'); 
require('dotenv').config(); 


//SQL is sturctured query language used to communicate with a relational databse. 
//PortgresSQL is a relational database management system
//neon db is a serverless cloud platform for postgressql
//pg is a library used to connect and run queries on a postgressql 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

app.get('/', async (req, res) => {
  let client; 
  try {
    client = await pool.connect(); 
    const { rows } = await client.query('SELECT version()');
    const version = rows[0]?.version || 'No version found';
    res.json({ version })  
  } catch (err) {
    console.error('database query failed', err); 
    res.status(500).json({ err})
  } finally {
    client?.release(); 
  }
})


app.listen(port, () => {
  console.log("listening to port 3000!")
})