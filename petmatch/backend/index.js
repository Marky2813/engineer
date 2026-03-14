import express from 'express'
import { createClient } from '@supabase/supabase-js'
const app = express();
const supabase = createClient("https://fnqkqblvdkjmntbzgwpx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucWtxYmx2ZGtqbW50Ynpnd3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjE1MDQsImV4cCI6MjA4ODk5NzUwNH0.Ak3GbgExFrJN_wsbH9L5r6kCg1IEmBNJ2Xzb7pJLsyQ")
const port = 3000;
app.use(express.json())

app.get("/pets", async (req, res) => {
  //fetch all the profiles from the supabase database and send it over to the base 
  //we have 2 query params for a filtered search, they are city and breed. now either the user will use no filter, or city or breed or both. how do we handle all this using one get request. 
  let query = supabase.from('Pet-Profiles').select();
  console.log(query)

  if(req.query.city) {
    query = query.ilike("city", req.query.city);
  }

  if(req.query.breed) {
    query = query.ilike("breed", req.query.breed); 
  }

  const {data, err} = await query; 
  if(err) {
    res.status(500).json({err: err.message})
  } 
  res.send(data)
})


app.post("/pets", async (req, res) => {
  const { error } = await supabase
    .from('Pet-Profiles')
    .insert({ id: 4, pet_name: "Nawab", breed: "American Bully", age: 8, gender: "Male", city: "Delhi", owner_contact: "+91-9871740518", photo_url: "tba" })

  res.send(error)
})

// app.get("/pets") not sure how to post get request having query params. no need to have a different get request, this will be handled by the existing get request only.  

app.listen(port, () => {
  console.log("listening to port 3000!")
})

//current objective is to build the get and the post network requests, test it in postman. no ai or gemini.

//following things which are needed to be taken care of
// photo url in the form or will be using multiple photo,
//id ka kya scene hai. 