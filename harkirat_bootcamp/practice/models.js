import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
  
//for all collections create a mongoose schema and model object
mongoose.connect(`mongodb://messagetosarthak_db_user:${process.env.DB_PASSWORD}@ac-g7ixpug-shard-00-00.qourxhc.mongodb.net:27017,ac-g7ixpug-shard-00-01.qourxhc.mongodb.net:27017,ac-g7ixpug-shard-00-02.qourxhc.mongodb.net:27017/todo?ssl=true&replicaSet=atlas-udipex-shard-0&authSource=admin&appName=Cluster0`)
const UsersSchema = new mongoose.Schema({
  username:String, password:String
});  

const TodoSchema = new mongoose.Schema({
  title:String, description:String, userId: mongoose.Types.ObjectId

})

const userModel = mongoose.model("users", UsersSchema); 
const todoModel = mongoose.model("todos", TodoSchema); 

export {userModel, todoModel }; 