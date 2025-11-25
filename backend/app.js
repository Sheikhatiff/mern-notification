import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import globalErrorHandler from "./controllers/errorController.js";
import entryRoute from "./routes/entryRoute.js";
import notificationRoute from "./routes/notificationRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || "development";

// CORS Configuration
const corsOptions = {
  origin: process.env.VITE_CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.get("/api", (_, res) => {
  res.send(
    `Server started running at http://localhost:${PORT} at ${ENVIRONMENT} mode.`
  );
});

app.use("/api/v1/entries", entryRoute);
app.use("/api/v1/notifications", notificationRoute);

// Error handling
app.use(globalErrorHandler);

export default app;
