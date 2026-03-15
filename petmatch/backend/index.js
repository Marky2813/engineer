import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const port = 3000;
app.use(cors())
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

  const {data:existing} = await supabase
  .from('Pet-Profiles')
  .select()
  .eq('owner_contact', req.body.owner_contact)
  .eq('pet_name', req.body.pet_name)

  if(existing.length > 0) {
    return res.status(400).json({error: 'Pet already registered'})
  }

  const { error } = await supabase
    .from('Pet-Profiles')
    .insert({pet_name: req.body.pet_name, breed: req.body.breed, age: req.body.age, gender: req.body.gender, city: req.body.city, owner_contact:req.body.owner_contact})

  currentid++
  res.send(error)
})

// app.get("/pets") not sure how to post get request having query params. no need to have a different get request, this will be handled by the existing get request only.  

app.get("/cities", async (req,res) => {
  const { data, error } = await supabase
  .from('Pet-Profiles')
  .select('city')

  const unique = [...new Set(data.map((d) => d.city))]
  res.json(unique)
})

app.get("/breeds", async (req, res) => {
  const { data, error } = await supabase
  .from('Pet-Profiles')
  .select('breed')

  const unique = [...new Set(data.map((d) => d.breed))]
  res.json(unique)
})

app.listen(port, () => {
  console.log("listening to port 3000!")
})

//current objective is to build the get and the post network requests, test it in postman. no ai or gemini.

//following things which are needed to be taken care of
// photo url in the form or will be using multiple photo,
//id ka kya scene hai. 