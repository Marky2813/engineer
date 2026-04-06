//the goal is to create a backend server for a TODO application as of now using in memory databases, after which we will migrate everything to mongodb. 
import express from 'express';
import jwt from 'jsonwebtoken'; 
import authMiddleware from './authMiddleware.js';
import { userModel, todoModel } from './models.js'; 


const app = express(); 
//we need to add the middleware which parses the body 
app.use(express.json()); 
//the first step is data modelling 
// const users = []; 
// let todo = []; 

// let userID = 1;
// let todoID = 1; 

app.post("/signup", async (req, res) => {
  const username = req.body.username; 
  const password = req.body.password;

  //now we need to check if the username already exists, if yes then return error that the particular username already exists. 

  const usernameExists = await userModel.findOne((e) => e.username === username); 

  if(usernameExists) {
    return res.status(403).send("username already exists, please use a different one"); 
  }

  //username dne, then we need to create user

  const newUser = await userModel.create({
    username, password
  })

  res.send(users)
});


app.post("/signin", async (req, res) => {
  const username = req.body.username; 
  const password = req.body.password; 

  //check in users if we have a user with the same usernaem and password

  const userExists = await userModel.findOne((e) => e.username === username && e.password === password); 
  
  if(!userExists) {
    return res.status(403).send("incorrect credentials!"); 
  }

  const token = jwt.sign({
    "userId": userExists.id 
  }, "sarthak123"); 

  res.json({
    token: token, 
  })
}); 
app.post("/todo", authMiddleware, (req, res) => {
  const userId = req.userId; 
  const title = req.body.title; 
  const description = req.body.description; 

  todo.push({
    title, description, userId, todoId:todoID++
  })

  res.send(todo);
}); //authenticated 


app.delete("/todo", authMiddleware, (req, res) => {
  const userId = req.userId;
  const todoId = Number(req.body.todoId); 
  todo = todo.filter((todo) => todo.userId !== userId && todo.todoId !== todoId)

  res.send(todo)
}); //authenticated 


app.listen(3000, () => {
  console.log("listening to port 3000!"); 
})