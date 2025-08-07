import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Load environment variables here

const mongodb_url = process.env.MONGO_URI;

let db = null;

const connection = async () => {
  try {
    const conn = await mongoose.connect(mongodb_url);
    db = conn.connection;
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connection() first.");
  }
  return db;
};

export { connection, getDB }; // ✅ Use ES module export
