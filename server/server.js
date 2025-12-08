import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import bodyParser from "body-parser";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";

//initialize express
const app = express();

//connect to db
await connectDB();
await connectCloudinary();

//Middleware
app.use(cors());
app.use(clerkMiddleware());

//Routes
app.get("/", (req, res) => res.send(" API working"))
//Clerk webhook endpoint MUST use raw body
// app.post("/clerk", bodyParser.raw({ type: "application/json" }), clerkWebhooks);
app.post('/clerk', express.json(), clerkWebhooks)
app.use(express.json());
app.use('/api/educator',express.json(), educatorRouter);
//AFTER webhook, now allow JSON

//port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});