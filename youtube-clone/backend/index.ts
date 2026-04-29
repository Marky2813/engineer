//now we need to create the backend of the V1. 
//unauthenticated end points will be signup/signin/getallvideos/getspecific videodetails, authenticated end points will be post video. get channel details

import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import express from "express";
import { z } from "zod/v4";
import { prisma } from './db';
import { password } from "bun";
import { S3Client, PutBucketCorsCommand, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
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
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const command = new PutBucketCorsCommand({
  Bucket: "youtube-clone-2813",
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedOrigins: ["http://localhost:3001", "http://localhost:3000"],
        AllowedMethods: ["PUT", "GET"],
        AllowedHeaders: ["*"],
        MaxAgeSeconds: 3000,
      },
    ],
  },
});

S3.send(command).then(() => console.log("CORS set")).catch(console.error);


function authMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).send("Unauthorized")
  }
  try {
    const decoded = jwt.verify(token, "1234") as { username: string };
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
  username: z.string().min(3),
  password: z.string().min(6)
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
  if (!result.success) {
    //this return is very important else the code will keep runnning
    return res.status(400).json({
      error: result.error.message
    })
  }
  //result.data.username, password, gender and channelname 
  const usernameExists = await prisma.user.findUnique({
    where: {
      username: result.data.username
    }
  })
  if (usernameExists) {
    return res.status(400).json({
      message: "user already exists"
    })
  }

  //before creating the user we need to hash the password and alter the data object
  const hash = await bcrypt.hash(result.data.password, saltrounds);
  result.data.password = hash;
  result.data.channelName = result.data.channelName.trim().replace(/\s+/g, '-'); //remove whitespace from the channel name

  //create user 
  const user = await prisma.user.create({
    data: result.data,
  })

  res.json({
    message: "user added",
    data: user,
  })
})

app.post('/signin', async (req, res) => {
  const result = signinSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).send("Invalid username or password");
  }

  const currentuser = await prisma.user.findUnique({
    where: {
      username: result.data.username
    }
  })

  if (!currentuser) {
    return res.status(400).send("incorrect username")
  }

  const valid = await bcrypt.compare(result.data.password, currentuser.password)

  if (!valid) {
    res.status(400).send("incorrect password")
  }
  //result.data has the username and the password
  const token = jwt.sign({
    username: result.data.username
  }, "1234")

  res.json({
    message: "signin complete",
    token
  })
})

app.get("/videos", async (req, res) => {
  let videos = await prisma.uploads.findMany({
    include: { user: { select: { id: true, channelName: true, profilePicture: true, banner: true } } },
    orderBy: { createdAt: "desc" }
  })
  videos = await Promise.all(videos.map(async (video) => {
    if (video.thumbnail.split('.')[2] == "jpeg") {
      const thumbnailUrl = await generateGetUrl(video.thumbnail);
      video.thumbnail = thumbnailUrl;
      return video;
    } else {
      return video;
    }
  }))
  if (!videos) return res.status(400).send("Unable to get videos");
  res.json(videos)
})

app.get("/videos/:id", async (req, res) => {
  const video = await prisma.uploads.findUnique({
    where: { id: req.params.id },
    include: { user: { select: { id: true, channelName: true, profilePicture: true, banner: true, subscriberCount: true } } }
  })
  if (video.videoUrl.split('.')[2] == "mp4") {
    const videoUrl = await generateGetUrl(video.videoUrl);
    video.videoUrl = videoUrl;
    console.log("get video url is working perfectly fine")
  }
  if (!video) res.status(400).send("Unable to get videos");
  res.json(video)
})

app.get("/channel/:channelName", async (req, res) => {
  try {
    const user = await isSignedIn(req);
    console.log("signed in status is", user.status, "and the id is", user.userId)
    let channelDetails = await prisma.user.findUnique({
      where: { channelName: req.params.channelName },
      select: {
        banner: true,
        profilePicture: true,
        description: true,
        subscriberCount: true,
        id:true, 
        uploads: {
          select: {
            thumbnail: true,
            description: true,
            videoUrl: true,
            id: true
          }
        }
      }
    })
    let subscriptionStatus = "subscribe";
    //subscripiton status can be self, subscribe and unsubscribe.
    if(user.status) {
      if(channelDetails?.id === user.userId) {
        subscriptionStatus = "self"
      } else {
        const isSubscribed = await prisma.subscription.findFirst({
          where: {
            subscribedById: user.userId, 
            subscribedToId: channelDetails?.id
          }
        });
        if(isSubscribed) {
          subscriptionStatus = "unsubscribe"
        } else {
          subscriptionStatus = "subscribe"
        }
      }
    } 
       // channelDetails.id === user.id then do not show the option to subscribe, if it is different then query to see if there exists a match, if no match then show subscribe. if match then show unsubscribe.
    channelDetails.uploads = await Promise.all(channelDetails.uploads.map(async (video) => {
      if (video.thumbnail.split('.')[2] == "jpeg") {
        const thumbnailUrl = await generateGetUrl(video.thumbnail);
        video.thumbnail = thumbnailUrl;
        const videoUrl = await generateGetUrl(video.videoUrl);
        video.videoUrl = videoUrl;
        return video;
      } else {
        return video;
      }
    }))
    res.json({
      channelDetails, subscriptionStatus
    })
  } catch (err) {
    console.error(err)
    res.send("request failed")
  }
})

app.post("/upload", authMiddleWare, async (req, res) => {
  // Handle video upload logic here
  const result = uploadSchema.safeParse(req.body);
  if (!result.success) {
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

  if (!userexists) {
    return res.status(400).json({
      message: "User does not exist"
    })
  }

  const uploaded = await prisma.uploads.create({
    data: result.data,
  })

  res.send(uploaded)
})

app.post("/getPresignedUrlVideo", async (req, res) => {
  //we are not going to be sharing the final url where the video is going to be published becasue we cannot make it public., 
  //key ke liye it should be math.random + name of the file. 
  const videoPath = "video" + Math.random() + ".mp4"
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
    putUrl: putUrl,
    key: videoPath
  })
})

app.post("/getVideoUrl", async (req, res) => {
  const path = req.body.videoPath;
  const getUrl = await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: "youtube-clone-2813", Key: path }),
    { expiresIn: 3600 }, // Valid for 1 hour
  );
  res.json({
    getUrl
  })
})

app.post("/getPresignedUrlThumbnail", async (req, res) => {
  //we are not going to be sharing the final url where the video is going to be published becasue we cannot make it public., 
  //key ke liye it should be math.random + name of the file. 
  const thumbnailPath = "video" + Math.random() + ".jpeg"
  const putUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: "youtube-clone-2813",
      Key: thumbnailPath, //key is we need to generate our own key. 
      ContentType: "image/jpeg",
    }),
    { expiresIn: 3600 },
  );
  res.json({
    putUrl: putUrl,
    key: thumbnailPath
  })
})

app.post("/getThumbnailUrl", async (req, res) => {
  const path = req.body.thumbnailPath;
  const getUrl = await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: "youtube-clone-2813", Key: path }),
    { expiresIn: 3600 }, // Valid for 1 hour
  );
  res.json({
    getUrl
  })
})

async function generateGetUrl(path: string) {
  const getUrl = await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: "youtube-clone-2813", Key: path }),
    { expiresIn: 3600 }, // Valid for 1 hour
  );
  return getUrl;
}

type SignedIn = {
  status:boolean, 
  username?:string, 
  userId?:string
}

async function isSignedIn(req: express.Request) {
  // Implementation for checking if user is signed in
  const signedIn: SignedIn = { status:false}; 
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("no token found")
      return signedIn;
    } 
    const decoded = jwt.verify(token, "1234") as { username: string };
    signedIn.status = true;
    signedIn.username = decoded.username
    signedIn.userId = (await prisma.user.findUnique({
      where: {
        username:signedIn.username
      }, 
      select: {
        id:true
      }
    }))?.id;
    return signedIn;
  } catch (err) {
    console.error("error verifying token", err)
    return signedIn;
  }
}


app.listen(3000, () => {
  console.log("listening to port 3000!")
})