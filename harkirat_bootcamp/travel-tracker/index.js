const express = require('express'); 
const { Pool } = require('pg'); 
require('dotenv').config();
const port = 3000; 

const app = express()
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

let total; 
let countries = '';  

app.get('/', async (req, res) => {
  //get the details of the total countries from the databse, store it in the object then render the ejs file if it is empty.
  let client; 
  try {
    client = await pool.connect(); 
    const  { rows }= await client.query('SELECT * FROM visited_countries');
    //rows is the array of all the total countries. 
    if(rows.length) {
      rows.forEach((e) => {
        if(countries.length) {
        countries = countries + `,${e.country_code}`
        } else {
          countries = countries + e.country_code;
        }
      })
      total = rows.length; 
    }
    res.render("index.ejs", {countries, total}) 
  } catch(err) {
    console.error("unable to query database", err); 
    res.status(500).json({err})
  } finally {
    client?.release(); 
  }
})

//now we need to handle the submit path, when the user enters the country. convert it to lower case and then find the country code from the other table, if the country does not exist then maybe prompt the user or just throw an error that the country does not exist. 



app.listen(port, () => {
  console.log("listening to port 3000"); 
})
