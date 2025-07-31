import express from "express";
import cors from 'cors';
import 'dotenv/config'
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import mongoose from "mongoose";

//Initialize Express
const app = express();

// mongoose.connect("mongodb+srv://shrutikashyap2709:A12bcdef@cluster0.pckfo8n.mongodb.net",{
//   dbName:"llm",
// }).then(()=>console.log("mongo db connected ")).catch((error)=>console.log("Error return: ",error))

//Connect to db
await connectDB()
//middleweares
app.use(cors())

//Route
app.get('/', (req,res)=>res.send("API Working"))
app.post('/clerk', express.json(), clerkWebhooks)

//port
const PORT =process.env.PORT || 5000

app.listen(PORT, ()=>{
  console.log(`server is running on ${PORT}`)
})
