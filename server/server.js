import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import User from './models/User.models.js';

//Initialize express app
const app = express();

//connect to database
await connectDB();
app.use(express.json());


//Middleware
app.use(cors());

//Routes
app.get('/', (req, res) =>  res.send('Welcome to the LMS server!  API working '));
app.post('/clerk', express.json(), clerkWebhooks);

// app.post('/user', async (req, res) => {
//   try {
//     const { _id, name, email, password, imageUrl } = req.body;
//     const user = await User.create({ _id, name, email, password, imageUrl });
//     res.status(201).json({ message: "User created", user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error creating user", error: error.message });
//   }
// });


//Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})