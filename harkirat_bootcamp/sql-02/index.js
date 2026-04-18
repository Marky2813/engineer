const express = require('express'); 
const app = express(); 
const port = 3000; 
const { Pool } = require('pg'); 
require('dotenv').config(); 
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

app.get('/', async (req, res) => {
  let client; 
  try {
  client = await pool.connect(); 
  const { rows } = await client.query("SELECT country FROM world_food WHERE country LIKE '%' || 'a' ");
  res.json({ rows });  
  } catch(err) {
    console.error("Unable to query database", err); 
    res.status(500).json({ err })
  } finally {
    client?.release(); 
}})

app.listen(port, () => {
  console.log("listening to port 3000!"); 
})