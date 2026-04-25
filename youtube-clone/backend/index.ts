//now we need to create the backend of the V1. 
//unauthenticated end points will be signup/signin/getallvideos/getspecific videodetails, authenticated end points will be post video. get channel details

import bcrypt from "bcrypt"; 
import cors from "cors"; 
import jwt from "jsonwebtoken"; 
import express from "express"; 
import { z } from "zod/v4"; 
import { prisma } from './db'; 
import { password } from "bun";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "auto", // Required by SDK but not used by R2
  // Provide your Cloudflare account ID
  endpoint: `https://s3.us-east-005.backblazeb2.com`,
  // Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

function authMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.split(" ")[1]; 
  if(!token) {
    return res.status(400).send("Unauthorized")
  } 
  try {
    const decoded = jwt.verify(token, "1234") as  { username: string };
    req.body.username = decoded.username;
    next();
  } catch (err) { 
    return res.status(400).send("Unauthorized"); 
  }
}
 
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

const uploadSchema = z.object({ 
  videoUrl: z.string().min(1),
  userId: z.string().min(1),
  thumbnail: z.string().min(1), 
  description: z.string().min(1)
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

app.post("/upload", authMiddleWare, async (req, res) => {
  // Handle video upload logic here
  const result = uploadSchema.safeParse(req.body);
  if(!result.success) { 
    return res.status(400).json({
      error: result.error.message
    })
  }
  // check if the user exists in the database 
  const userexists = await prisma.user.findUnique({
    where: {
      id: result.data.userId
    }
  })

  if(!userexists) {
    return res.status(400).json({
      message: "User does not exist"
    })
  }

  const uploaded = await prisma.uploads.create({
    data:result.data,
  })

  res.send(uploaded)
})

app.post("/getPresignedUrl", async (req, res) => {
    //we are not going to be sharing the final url where the video is going to be published becasue we cannot make it public., 
    //key ke liye it should be math.random + name of the file. 
    const videoPath = "/video" + Math.random() +".mp4"
    const putUrl = await getSignedUrl(
  S3,
  new PutObjectCommand({
    Bucket: "youtube-clone-2813",
    Key: videoPath, //key is we need to generate our own key. 
    ContentType: "video/mp4",
  }),
  { expiresIn: 3600 },
);
  res.json({
    putUrl: putUrl
  })
  })


app.listen(3000, () => {
  console.log("listening to port 3000!")
})