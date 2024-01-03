import mongoose from "mongoose";

export async function connectDB() {
  try {
    // DB Connection str using compass
    const compassDBURL = process.env.DB_URL;
    // DB Connection str using MongoDB Atlas in Browser (Online)
    const atlasDBURL = process.env.ATLAS_DB_URL;
    await mongoose.connect(atlasDBURL);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.log(error);
  }
}
