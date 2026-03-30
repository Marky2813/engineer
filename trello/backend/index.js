//username, passwords
// orgs
// issues
// boards

const users = [];
const orgs = [];
const issues = [];
const backend = [];

//this step is creating a db schema, for us creating the variables and throughout the entire backend we will just be playing around these

import express from 'express'
const app = express();
const post = 3000; 

//CREATE
app.post("/signup", (req, res) => {})
app.post("/signin", (req, res) => {})
app.post("/org", (req, res) => {})
app.post("/add-member-to-org", (req, res) => {})
app.post("/board", (req, res) => {})
app.post("/issue", (req, res) => {})

//READ
app.get("/boards", (req, res) => {})
app.get("/issues", (req, res) => {})
app.get("/members", (req, res) => {})

//UPDATE
app.put("/issues", (req, res) => {})

//DELETE
app.delete("/member", (req, res) => {})
app.listen(port)