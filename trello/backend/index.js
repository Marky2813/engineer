//username, passwords
// orgs
// issues
// boards
import { userModel, orgsModel, boardsModel, issuesModel } from './models.js';

// const users = [{ username: 'messagetosarthak@gmail.com', password: '123', id: 1 },
//   { username: 'messagetorohan@gmail.com', password: '123', id: 2 }];
// const orgs = [{
//     title: "Sarthak's team",
//     description: "Sarthak's team org",
//     id: 1,
//     admin: 1,
//     members: [ 2 ]
//   }];
const issues = [];
const boards = [];

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
app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password; 

  const usernameExists = await userModel.findOne({username:username});
  if(usernameExists) {
   return res.status(403).send("User already exists")
  }

  
  const newUser = await userModel.create({
    username: username, 
    password: password,
  })

  res.send("signup successful", newUser._id)
})
app.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const userExists = await userModel.findOne({username:username, password:password});

  if(!userExists) 
    {
     return res.status(403).send("Incorrect credentials");
    }
  const token = jwt.sign({userId: userExists._id}, "123")

  console.log(userExists)

  res.json({
    token:token
  })
})
app.post("/org", authMiddleware, async (req, res) => {
    const userId = req.userId;
    
    //it also needs to be checked that no 2 orgs have the same name. 

    const newOrg = await orgsModel.create({
      title: req.body.title, 
      description: req.body.description, 
      admin: userId, 
      members: [], 
    })

    console.log(newOrg)

    res.json({
      message: "org created", 
      id: newOrg._id,
    })
})

app.post("/add-member-to-org", authMiddleware, async (req, res) => {
  //only admins of a particular org can add members to that org. the request should also have information about which org are we referring too  
  const userId = req.userId; //person making the request, needs to be the admin
  const orgId =  req.body.orgId; //this is the org being referred to
  const memberName = req.body.member 
  //the member needs to be added 
  
  //the request will be having the username of the member, from that we need to extract the memberId. 
  const memberId = await userModel.findOne({
    username: memberName
  })
  
  const org = await orgsModel.findOne({
    _id:orgId, 
  })

  console.log(org.admin, userId)
  
  //memberId cannot be the admin of the org, if member is already a part of the org then say member already exists. 
  if(!org || org.admin.toString() !== userId) {
    return res.status(403).send("You cannot make changes to this org since you are not the admin");
  }

  if(org.members.find((e) => e === memberId)) {
    return res.send("member already exists")
  }

  const memberAdded = await orgsModel.updateOne({_id:orgId}, {
    $push: {members:memberId}
  });

  console.log(org)

  res.send("Member added!", memberAdded)
})

app.post("/board", authMiddleware, async (req, res) => {
  //board will belong to a particular org. 
  const userId = req.userId; 
  const orgId = req.body.orgId; 
  const title = req.body.title;

  //all the members and the admin of the org can create boards

  const org = await orgsModel.findOne({_id:orgId})
  if(!org) {
    return res.status(403).send("org does not exist"); 
  }

  if(!(org.admin.toString() === userId || org.members.find(member => member.toString() === userId)))
  {
   return  res.status(403).send("cannot access org, neither admin nor member"); 
  }

  const newBoard = await boardsModel.create({
    id:boards_id++,
    title:title, 
    orgId:orgId 
  })
  

  res.json({
    message: "board created", 
    boardId: newBoard._id, 
  })
})

app.post("/issue", authMiddleware, async (req, res) => {
  const userId = req.userId; 
  const orgId = req.body.orgId; 
  const title = req.body.title;
  const boardId = req.body.boardId;
  const status = req.body.status || "pending";  

  //all the members and the admin of the org can create boards

  const org = await orgsModel.findOne({
  _id:orgId
});
  if(!org) {
    res.status(403).send("org does not exist"); 
  }

  if(!(org.admin.toString() === userId || org.members.find(member => member.toString() === userId)))
  {
    res.status(403).send("cannot access org, neither admin nor member"); 
  }

  const newIssue = await issuesModel.create({
    title:title, 
    orgId:orgId, 
    boardId:boardId, 
    status:status
  })
  
  res.json({
    message:"Issue created", 
    issueId: newIssue._id 
  })
})

//READ
app.get("/orgs", authMiddleware, async (req, res) => {
  const getOrgs = await orgsModel.find(); 
  
  res.json({
    orgs: getOrgs,
  })
})
app.get("/boards", authMiddleware, async (req, res) => {
  const orgId = req.body.orgId; 
  const allBoards = await boardsModel.find({orgId}); 
  res.json({
    boards:allBoards,
  })
})
app.get("/issues", authMiddleware, async (req, res) => {
  const orgId = (req.body.orgId); 
  const boardId = (req.body.boardId);
  const issues = await issuesModel.find({
    orgId, boardId
  })
  res.json({
    issues
  })
})
app.get("/members", authMiddleware, async (req, res) => {
  const orgId = req.body.orgId; 
  const org = await orgsModel.find({_id:orgId})
 
  res.json({
    members:org[0].members
  })
})

//UPDATE
app.put("/issues", authMiddleware, async (req, res) => {
  const userId = req.userId; 
  const issueId = req.body.issueId; 

  const issueUpdated = await issuesModel.updateOne({_id:issueId} , {
    $set:{status:"completed"}
  })
  res.json({
    message:"issue has been updated", 
    id:issueUpdated._id
  })
})

//DELETE
app.delete("/member", authMiddleware, async (req, res) => {
  const userId = req.userId; //person making the request, needs to be the admin
  const orgId =  req.body.orgId; //this is the org being referred to
  const memberName = req.body.member;
  
  const memberId = await userModel.findOne({
    username:memberName
  })//the member needs to be added 
  const org = await orgsModel.findOne({_id:orgId}); 
  //memberId cannot be the admin of the org, if member is already a part of the org then say member already exists. 
  console.log(org, memberId)
  if(org.admin.toString() !== userId) {
    return res.status(403).send("You cannot make changes to this org since you are not the admin");
  }

  const removeMember = await orgsModel.updateOne({_id:orgId}, {
    $pull: {members:memberId._id}
  })

  res.json({
    message:"Member removed", 
    id:memberId, 
  })
})


app.listen(port, () => {
  console.log("hello from port 3000!")
})


//test01
//sarthak's token= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc3NDk2MTQ3OX0.oxsGjveK-0MefYZvZJyWTLo0zwj2sfZqTTSjaxYOFAM