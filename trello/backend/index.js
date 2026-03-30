//username, passwords
// orgs
// issues
// boards

const users = [];
const orgs = [];
const issues = [];
const backend = [];

const users_id = 1;
const orgs_id = 1;
const boards_id = 1;
const issues_id = 1;

//this step is creating a db schema, for us creating the variables and throughout the entire backend we will just be playing around these

import express from 'express'
import jwt from 'jsonwebtoken'; 

const app = express();
const port = 3000; 
app.use(express.json())

function authMiddleware(req, res, next) {
  const token = req.headers.token; 
  if(!token) {
    res.status(403).send("You are not signed in!");
    
  }

  const decoded = jwt.verify(token, "123"); 
  const id = decoded.userId; 


  if(!username) {
    res.status(403).send("malformed token!"); 
  }


  req.userid = id;

  next(); 
}

//CREATE
app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password; 

  const usernameExists = username.find((ui) => ui.username === username);
  if(usernameExists) {
    res.status(403).send("User already exists")
  }

  users.push({
    username: username, 
    password: password,
    id: users_id++,
  })
})
app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const userExists = users.find(user => user.username === username && user.password === password);

  if(!userExists) res.status(403).send("Incorrect credentials");

  const token = jwt.sign({userId: userExists.id}, "123")
  res.json({
    token:token
  })
})
app.post("/org", (req, res) => {})
app.post("/add-member-to-org", (req, res) => {})
app.post("/board", (req, res) => {})
app.post("/issue", (req, res) => {})

//READ
app.get("/boards", (req, res) => {})
app.get("/issues", (req, res) => {})
app.get("/members", (req, res) => {})

//UPDATE
app.put("/issues", (req, res) => {})

//DELETE
app.delete("/member", (req, res) => {})
app.listen(port)