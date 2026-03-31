import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const token = req.headers.token; 
  if(!token) {
    res.status(403).send("You are not signed in!");
    
  }

  const decoded = jwt.verify(token, "123"); 
  const id = decoded.userId; 


  if(!id) {
    res.status(403).send("malformed token!"); 
  }


  req.userId = id;

  next(); 
}
