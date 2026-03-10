const express = require('express');
const app = express();
let path = require('path')
//someone came and said i have created this framework which has all the functionality of handling network requests. now we have created an object which is an isntance from that framework. 

const port = 3000;

app.get("/", (req, res) => {
  // console.log(req.query.a, req.query.b)
  // const sum = Number(req.query.a) + Number(req.query.b);
  // res.send(`<h2>${sum}</h2>`);
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get("/cal", (req, res) => {
  // console.log(req.query.a, req.query.b)
  // const sum = Number(req.query.a) + Number(req.query.b);
  // res.send(`<h2>${sum}</h2>`);
  res.json("response has been recieved!")
})

app.listen(port, () => {
  console.log("hello from port 3000")
})

// 127.0.0.1 is the loopback address. this refers to your own machine, basically local host ka ip address yahi hai. :dynamic routes.extract the dynamic routes using params. 