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

 

let currentUserId = 1;

let users = [
];
let color;

app.get('/', async (req, res) => {
  //get the details of the total countries from the databse, store it in the object then render the ejs file if it is empty.
  let client;
  let total = 0; 
  let countries = '';  
  try {
    client = await pool.connect();
    const userarray = await client.query('SELECT * FROM users');
    users = userarray.rows;
    color = users.filter(e => e.id == currentUserId)[0].color;
    const  { rows }= await client.query('SELECT * FROM visited_countries WHERE visited_countries.user_id = $1', [currentUserId]); //where clause aayega abh yaha
    //rows is the array of all the total countries. 
    if(rows.length) {
      //converting into a string because of server side rendering 
      rows.forEach((e) => {
        if(countries.length) {
        countries = countries + `,${e.country_code}`
        } else {
          countries = countries + e.country_code;
        }
      })
      total = rows.length; 
    }
    console.log(countries, total, users, color)
    res.render("index.ejs", {countries, total, users, color})  //    users: users,
    //color: "teal", abh render object mei yeh sabh cheeze bhi add karni hai
  } catch(err) {
    console.error("unable to query database", err); 
    res.status(500).json({err})
  } finally {
    client?.release(); 
  }
})

//now we need to handle the submit path, when the user enters the country. convert it to lower case and then find the country code from the other table, if the country does not exist then maybe prompt the user or just throw an error that the country does not exist. 

app.post("/add", async (req, res) => {
  const country = req.body.country.trim(); 
  let client; 
  try {
    client = await pool.connect(); 
    const { rows } = await client.query("SELECT country_code FROM tracker_countries WHERE LOWER(country_name) = $1", [country.toLowerCase()]);
    console.log(rows)
    //array of country_code: value; 
    if(rows.length == 0) {
      res.redirect('/'); 
    }
    const { result } = await client.query("INSERT INTO visited_countries(country_code, user_id) VALUES ($1, $2)", [rows[0].country_code, currentUserId])
    res.redirect('/') 
  } catch(err) {
    console.error("unable to query database", err); 
    res.status(500).json({err})
  } finally {
    client?.release(); 
  }
})

app.post("/user", async (req, res) => {
  let posssibleId = req.body.user; 
  let isNew = req.body.add; 
  if(isNew == 'new') {
    res.render("new.ejs")
  } else {
    currentUserId = posssibleId;
    res.redirect("/");  
  }
});

app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color; 
  try {
    client = await pool.connect();
    const { rows }= await client.query('INSERT INTO users(name, color) VALUES ($1, $2)', [name, color]);
    res.redirect("/")
  } catch(err) {
    console.error("unable to query database", err); 
    res.status(500).json({err})
  } finally {
    client?.release(); 
  } 
  
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log("listening to port 3000");
})
