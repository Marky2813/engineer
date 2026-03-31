//username, passwords
// orgs
// issues
// boards

const users = [{ username: 'messagetosarthak@gmail.com', password: '123', id: 1 },
  { username: 'messagetorohan@gmail.com', password: '123', id: 2 }];
const orgs = [{
    title: "Sarthak's team",
    description: "Sarthak's team org",
    id: 1,
    admin: 1,
    members: [ 2 ]
  }];
const issues = [];
const boards = [];

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

app.post("/board", authMiddleware, (req, res) => {
  //board will belong to a particular org. 
  const userId = req.userId; 
  const orgId = Number(req.body.orgId); 
  const title = req.body.title;

  //all the members and the admin of the org can create boards

  const org = orgs.find((org) => org.id === orgId);
  if(!org) {
    return res.status(403).send("org does not exist"); 
  }

  if(!(org.admin === userId || org.members.find(member => member === userId)))
  {
   return  res.status(403).send("cannot access org, neither admin nor member"); 
  }

  boards.push({
    id:boards_id++,
    title:title, 
    orgId:orgId 
  })
  
  console.log(boards)
  res.send("Board created")
})

app.post("/issue", authMiddleware, (req, res) => {
  const userId = req.userId; 
  const orgId = Number(req.body.orgId); 
  const title = req.body.title;
  const boardId = Number(req.body.boardId); 

  //all the members and the admin of the org can create boards

  const org = orgs.find((org) => org.id === orgId);
  if(!org) {
    res.status(403).send("org does not exist"); 
  }

  if(!(org.admin === userId || org.members.find(member => member === userId)))
  {
    res.status(403).send("cannot access org, neither admin nor member"); 
  }

  issues.push({
    id:issues_id++,
    title:title, 
    orgId:orgId, 
    boardId:boardId
  })
  console.log(issues)
  res.send("Issue created")
})

//READ
app.get("/orgs", authMiddleware, (req, res) => {
  res.json({
    orgs: orgs,
  })
})
app.get("/boards", authMiddleware, (req, res) => {
  const orgId = Number(req.body.orgId); 
  res.json({
    boards:boards.filter(board => board.orgId === orgId),
  })
})
app.get("/issues", authMiddleware, (req, res) => {
  const orgId = Number(req.body.orgId); 
  const boardId = Number(req.body.boardId)
  res.json({
    issues:issues.filter(issue => issue.boardId === boardId && issue.orgId === orgId),
  })
})
app.get("/members", authMiddleware, (req, res) => {
  const orgId = Number(req.body.orgId); 
  const org = orgs.find(org => org.orgId === orgId)

  const members = org.members;
  res.json({
    members:members
  })
})

//UPDATE
app.put("/issues", authMiddleware, (req, res) => {})

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