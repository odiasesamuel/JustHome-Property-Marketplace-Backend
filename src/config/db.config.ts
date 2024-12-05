import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const connectToDatabase = async (callback: () => void) => {
  try {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;

    if (!connectionString) throw new Error("MONGODB_CONNECTION_STRING is not defined in the environment variables");

    const result = await mongoose.connect(connectionString);
    // console.log(result);
    callback();
  } catch (error) {
    console.log(error);
  }
};
