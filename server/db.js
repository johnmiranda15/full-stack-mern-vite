import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
import { initializeDatabase } from "./libs/initialSetup.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
    // Inicializar la base de datos (roles y administrador)
    initializeDatabase();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to", mongoose.connection.db.databaseName);
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});