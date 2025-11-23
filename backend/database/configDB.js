import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DB_URI = process.env.DATABASE_URI.replace(
  "<DB_PASS>",
  process.env.DB_PASS
);
export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
