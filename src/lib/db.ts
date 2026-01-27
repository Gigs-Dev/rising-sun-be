import mongoose from "mongoose";
import { NODE_ENV, DB_URI } from "../config/env.config";

export const connectDB = async (): Promise<void> => {
  if (!DB_URI) {
    throw new Error("Please provide a MongoDB connection URI");
  }

  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(DB_URI)

    console.log(
      `MongoDB connected: ${conn.connection.host} (${NODE_ENV})`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); 
  }

  // Connection event listeners
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.info("MongoDB reconnected");
  });
};

export default connectDB;
