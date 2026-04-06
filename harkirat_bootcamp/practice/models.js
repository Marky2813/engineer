import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();  
//for all collections create a mongoose schema and model object
mongoose.connect(`mongodb+srv://messagetosarthak_db_user:${process.env.DB_PASSWORD}@cluster0.qourxhc.mongodb.net/`)
const UsersSchema = new mongoose.Schema({
  name:String, password:String
});  

const TodoSchema = new mongoose.Schema({
  title:String, description:String, userId: mongoose.Types.ObjectId

})

const userModel = mongoose.model("users", UsersSchema); 
const todoModel = mongoose.model("todos", TodoSchema); 

export {userModel, todoModel }; 