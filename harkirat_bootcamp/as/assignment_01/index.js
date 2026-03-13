//express is a library which we use which provide us all the code to mess with http requests. 

const express = require("express");
const app = express(); //this app is an instance of this network
let path = require('path');
let requests = 0;
const port = 3000;

app.use(function middleware(req, res, next) {
  requests++;
  next()
})

app.get("/requests", (req, res) => {
  res.send(`number of requests are ${requests}`)
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 
    "/index.html"
  ));  
})

app.listen(port, () => {
  console.log("hello from port 3000")
  console.log(requests)
})
