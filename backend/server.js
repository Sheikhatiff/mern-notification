import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./database/configDB.js";
import { setupSocketHandlers } from "./utils/socketHandler.js";
import app from "./app.js";

const __dirname = path.resolve();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config();

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || "development";

// Create HTTP server with Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Make io instance globally available for use in controllers
global.io = io;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("/*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const server = httpServer.listen(PORT, () => {
  console.log(
    `Server is running in ${ENVIRONMENT} mode on http://localhost:${PORT}`
  );
  connectDB();
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
