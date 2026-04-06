import jwt from "jsonwebtoken"; 

function authMiddleware(req, res, next) {
  //this assumes that whichever request will be coming, now we will be getting the token in that request. then we will verify that token
  const token = req.headers.token; 
  if(!token) {
    res.status(403).send("You are not signed in"); 
  }
  const decoded = jwt.verify(token, "sarthak123"); 
  const userId = decoded.userId; 

  if(!userId) {
    res.status(403).send("Malformed token"); 
  }
  req.userId = userId;
  next(); 
}

export default authMiddleware; 