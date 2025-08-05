import express from "express";
import cors from 'cors';
import 'dotenv/config'
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import mongoose from "mongoose";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";

//Initialize Express
const app = express();

//Connect to db
await connectDB()
//middleweares
app.use(cors())
app.use(clerkMiddleware())

//Route
app.get('/', (req,res)=>res.send("API Working"))
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter)

//port
const PORT =process.env.PORT || 5000

app.listen(PORT, ()=>{
  console.log(`server is running on http://localhost:${PORT}`)
})


