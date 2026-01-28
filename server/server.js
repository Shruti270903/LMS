// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import connectDB from "./configs/mongodb.js";
// import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
// import educatorRouter from "./routes/educatorRoutes.js";
// import bodyParser from "body-parser";
// import { clerkMiddleware } from "@clerk/express";
// import connectCloudinary from "./configs/cloudinary.js";
// import courseRouter from "./routes/courseRoute.js";
// import userRouter from "./routes/userRoutes.js";

// //initialize express
// const app = express();




// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// //connect to db
// await connectDB();

// await connectCloudinary();
// //Middleware
// app.use(cors({
//   origin:["https://lms-frontend-62er.onrender.com"],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//      allowedHeaders: ["Content-Type", "Authorization"],
//   credentials:true
// }));
// app.use(clerkMiddleware());

// //Routes
// app.get("/", (req, res) => res.send(" API working"))
// app.post('/clerk', express.json(), clerkWebhooks)
// app.use('/api/educator',express.json(), educatorRouter);
// app.use('/api/course', express.json(), courseRouter)
// app.use('/api/user', express.json(), userRouter)
// app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)
// //port
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running → http://localhost:${PORT}`);
// });

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

/* =======================
   Core Middleware
======================= */

// ✅ CORS (must come first)
app.use(
  cors({
    origin: "https://lms-frontend-62er.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Clerk auth
app.use(clerkMiddleware());

// ✅ JSON parser (ONCE only)
app.use(express.json());

/* =======================
   Services
======================= */

await connectDB();
await connectCloudinary();

/* =======================
   Routes
======================= */

app.get("/", (req, res) => res.send("API working"));

app.post("/clerk", express.json(), clerkWebhooks);

app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

/* =======================
   Stripe (RAW body – MUST be last)
======================= */

app.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

/* =======================
   Server
======================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
