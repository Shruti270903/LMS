// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import cookieParser from "cookie-parser";

// import connectDB from "./configs/mongodb.js";
// import { stripeWebhooks } from "./controllers/webhooks.js";

// import adminRouter from "./admin/routes/adminRoutes.js";
// import educatorRouter from "./routes/educatorRoutes.js";
// import connectCloudinary from "./configs/cloudinary.js";
// import courseRouter from "./routes/courseRoute.js";
// import userRouter from "./routes/userRoutes.js";
// import authRouter from "./auth/routes/authRoutes.js";

// const app = express();

// // =======================
// // CORS
// // =======================

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5000",
//   "https://lms-frontend-62er.onrender.com",
//   "https://lms-vnl5.onrender.com",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// // =======================
// // Core Middleware
// // =======================

// app.use(cookieParser());
// app.use(express.json({ limit: "8mb" }));

// // =======================
// // Services
// // =======================

// await connectDB();
// connectCloudinary();

// // =======================
// // Routes
// // =======================

// app.get("/", (req, res) => res.send("API working"));

// app.use("/api/auth", authRouter);
// app.use("/api/educator", educatorRouter);
// app.use("/api/course", courseRouter);
// app.use("/api/user", userRouter);
// app.use("/api/admin", adminRouter);

// // =======================
// // Stripe Webhook
// // =======================

// app.post(
//   "/stripe",
//   express.raw({ type: "application/json" }),
//   stripeWebhooks
// );

// // =======================
// // Server
// // =======================

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running → http://localhost:${PORT}`);
// });


import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./configs/mongodb.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

import adminRouter from "./admin/routes/adminRoutes.js";
import educatorRouter from "./routes/educatorRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./auth/routes/authRoutes.js";

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://lms-frontend-62er.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Core middleware
app.use(cookieParser());

// Stripe webhook must receive the raw body
app.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

app.use(express.json({ limit: "8mb" }));

// Services
await connectDB();
connectCloudinary();

// Health check
app.get("/", (req, res) => res.send("API working"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
