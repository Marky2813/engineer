//now let us shift our in memmory database to mongoDB. 
import dotenv from 'dotenv'; 
dotenv.config(); 
import mongoose from 'mongoose'; 

mongoose.connect(`mongodb://messagetosarthak_db_user:${process.env.DB_PASSWORD}@ac-g7ixpug-shard-00-00.qourxhc.mongodb.net:27017,ac-g7ixpug-shard-00-01.qourxhc.mongodb.net:27017,ac-g7ixpug-shard-00-02.qourxhc.mongodb.net:27017/trello?ssl=true&replicaSet=atlas-udipex-shard-0&authSource=admin&appName=Cluster0`)

const UsersSchema = new mongoose.Schema({
  username:String, password:String
})
const OrgsSchema = new mongoose.Schema({
  title:String, description:String, admin:mongoose.Types.ObjectId, members:[mongoose.Types.ObjectId]
})
const BoardsSchema = new mongoose.Schema({
  title:String, 
  orgId:mongoose.Types.ObjectId, 
})

const IssuesSchema = new mongoose.Schema({
  title:String, 
  status:String, 
  boardId:mongoose.Types.ObjectId, 
  orgId:mongoose.Types.ObjectId
})

const userModel = mongoose.model("users", UsersSchema); 
const orgsModel = mongoose.model("orgs", OrgsSchema);
const boardsModel = mongoose.model("boards", BoardsSchema); 
const issuesModel = mongoose.model("issues", IssuesSchema); 


export {userModel, orgsModel, boardsModel, issuesModel}; 

//model in mongoose use the schema to build the collections. This model provides the functionallity to do CRUD operations. 