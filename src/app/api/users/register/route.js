import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
connectDB();

export async function POST(req) {
  try {
    const reqBody = await req.json();

    // Check if user already exists
    const userExist = await User.findOne({ email: reqBody.email });
    if (userExist) {
      throw new Error("User already exists!");
    }

    // Hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(reqBody.password, salt);
    reqBody.password = hashedPassword;

    // Create User
    await User.create(reqBody);

    // Return success response
    return NextResponse.json({
      message: "User created successfully!",
    });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
