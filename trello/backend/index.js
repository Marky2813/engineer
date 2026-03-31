//username, passwords
// orgs
// issues
// boards

const users = [];
const orgs = [];
const issues = [];
const backend = [];

let users_id = 1;
let orgs_id = 1;
let boards_id = 1;
let issues_id = 1;

//this step is creating a db schema, for us creating the variables and throughout the entire backend we will just be playing around these

import express from 'express'
import jwt from 'jsonwebtoken'; 
import { authMiddleware } from './middleware.js';


const app = express();
const port = 3000; 
app.use(express.json())



//CREATE
app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password; 

  const usernameExists = users.find((ui) => ui.username === username);
  if(usernameExists) {
    res.status(403).send("User already exists")
  }

  
  users.push({
    username: username, 
    password: password,
    id: users_id++,
  })

  res.send("signup successful")
})
app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const userExists = users.find(user => user.username === username && user.password === password);

  if(!userExists) res.status(403).send("Incorrect credentials");

  const token = jwt.sign({userId: userExists.id}, "123")

  console.log(users)

  res.json({
    token:token
  })
})
app.post("/org", authMiddleware, (req, res) => {
    const userId = req.userId;
    
    //it also needs to be checked that no 2 orgs have the same name. 

    orgs.push({
      title: req.body.title, 
      description: req.body.description, 
      id: orgs_id++, 
      admin: userId, 
      members: [], 
    })

    console.log(orgs)

    res.json({
      message: "org created", 
      id: orgs_id - 1,
    })
})

app.post("/add-member-to-org", authMiddleware, (req, res) => {
  //only admins of a particular org can add members to that org. the request should also have information about which org are we referring too  
  const userId = req.userId; //person making the request, needs to be the admin
  const orgId =  Number(req.body.orgId); //this is the org being referred to
  const memberId = users.find((e) => e.username === req.body.member).id; //the member needs to be added 
  
  //memberId cannot be the admin of the org, if member is already a part of the org then say member already exists. 
  if(orgs[orgId-1].admin !== userId) {
    return res.status(403).send("You cannot make changes to this org since you are not the admin");
  }

  if(orgs[orgId-1].members.find(member => member === memberId)) {
    return res.send("member already exists")
  }

  orgs[orgId-1].members.push(memberId);

  console.log(orgs)

  res.send("Member added!")
})

app.post("/board", (req, res) => {})
app.post("/issue", (req, res) => {})

//READ
app.get("/boards", (req, res) => {})
app.get("/issues", (req, res) => {})
app.get("/members", (req, res) => {})

//UPDATE
app.put("/issues", (req, res) => {})

//DELETE
app.delete("/member", authMiddleware, (req, res) => {
  const userId = req.userId; //person making the request, needs to be the admin
  const orgId =  Number(req.body.orgId); //this is the org being referred to
  const memberId = users.find((e) => e.username === req.body.member).id; //the member needs to be added 
  
  //memberId cannot be the admin of the org, if member is already a part of the org then say member already exists. 
  if(orgs[orgId-1].admin !== userId) {
    return res.status(403).send("You cannot make changes to this org since you are not the admin");
  }

  orgs[orgId-1].members = orgs[orgId-1].members.filter(member => member !== memberId);

  console.log(orgs)

  res.send("Member removed!")
})
app.listen(port, () => {
  console.log("hello from port 3000!")
})


//test01
//sarthak's token= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3NDk2MTQ3OX0.oxsGjveK-0MefYZvZJyWTLo0zwj2sfZqTTSjaxYOFAM