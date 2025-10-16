import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import User from './models/User.models.js';

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // keep this ONCE globally

// ✅ Connect MongoDB
await connectDB();

// ✅ Routes
app.get('/', (req, res) => {
  res.send('Welcome to the LMS server! API working');
});

app.post('/clerk', clerkWebhooks);

// // ✅ User creation route
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


// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
