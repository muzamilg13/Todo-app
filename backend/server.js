import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";

// App config
const app = express();
const PORT = process.env.PORT || 8001;
mongoose.set("strictQuery", true);

// Middlewares
app.use(express.json());
app.use(cors());

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
.then(() => console.log("DB Connected"))
.catch(err => console.error("DB Connection Error:", err));

// Health check (REQUIRED for ECS / ALB)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/forgotPassword", forgotPasswordRouter);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown (ECS / Docker)
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
