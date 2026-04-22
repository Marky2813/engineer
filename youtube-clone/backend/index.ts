//now we need to create the backend of the V1. 
//unauthenticated end points will be signup/signin/getallvideos/getspecific videodetails, authenticated end points will be post video. get channel details

import bcrypt from "bcrypt"; 
import cors from "cors"; 
import jwt from "jsonwebtoken"; 
import express from "express"; 
import { z } from "zod/v4"; 
import { prisma } from './db'; 
import { password } from "bun";

const app = express(); 
const saltrounds = 10; 
app.use(cors())
app.use(express.json());


//what i am able to understand is that using zod we will first define the signup schema. what all should our signup schema contain? username, password, gender. then we will validate the request body using this schema. if the validation is successful then we will check if the user already exists in the database. if the user already exists then we will return an error message. if the user does not exist then we will hash the password and store the user in the database.

const signupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6), 
  gender: z.enum(["Male", "Female", "Other"]), 
  channelName: z.string().min(1)
})


const signinSchema = z.object({
  username:z.string().min(3), 
  password:z.string().min(6)
})

app.post('/signup', async (req, res) => {
//get the username, password from the request and see if another user exist with the same username. return
const result = signupSchema.safeParse(req.body); 
if(!result.success) {
  //this return is very important else the code will keep runnning
  return res.status(400).json({
    error:result.error.message
  })
}
//result.data.username, password, gender and channelname 
const usernameExists = await prisma.user.findUnique({
  where: {
    username:result.data.username
  }
})
if(usernameExists) {
  return res.status(400).json({
    message:"user already exists"
  })
}

//before creating the user we need to hash the password and alter the data object
const hash = await bcrypt.hash(result.data.password, saltrounds); 
result.data.password = hash;  

//create user 
const user = await prisma.user.create({
  data: result.data,
})

res.json({
  message:"user added", 
  data: user,
})
})

app.post('/signin', async (req, res) => {
  const result = signinSchema.safeParse(req.body); 
  if(!result.success) {
    return res.status(400).send("Invalid username or password"); 
  }

  const currentuser = await prisma.user.findUnique({
    where: {
      username: result.data.username
    }
  })

  if(!currentuser) {
    return res.status(400).send("incorrect username")
  }

  const valid = await bcrypt.compare(result.data.password, currentuser.password)

  if(!valid) {
    res.status(400).send("incorrect password")
  }
  //result.data has the username and the password
  const token = jwt.sign({
    username:result.data.username
  }, "1234")

  res.json({
    message:"signin complete", 
    token
  })
})

app.get("/videos", async (req, res) => {
  const videos = await prisma.uploads.findMany({
    include: {user : { select: { id: true, channelName: true, profilePicture: true, banner: true }}}, 
    orderBy: { createdAt: "desc"}
  })
  if(!videos) res.status(400).send("Unable to get videos"); 
  res.json(videos)
})

app.get("/videos/:id", async (req, res) => {
  const video = await prisma.uploads.findUnique({
    where: { id: req.params.id }, 
    include: { user : {select: { id: true, channelName: true, profilePicture: true, banner: true, subscriberCount: true}}}
  })
  if(!video) res.status(400).send("Unable to get videos"); 
  res.json(video)
})


app.listen(3000, () => {
  console.log("listening to port 3000!")
})