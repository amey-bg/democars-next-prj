import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
connectDB();

export async function POST(req) {
  try {
    const reqBody = await req.json();

    // Check if user exists
    const user = await User.findOne({ email: reqBody.email });
    // console.log("User = ", user);
    if (!user) {
      throw new Error("User not found!");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("User is Inactive, please contact admin.");
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(reqBody.password, user.password);
    if (!validPassword) {
      throw new Error("Invalid password!");
    }

    //Get response
    const response = NextResponse.json({ message: "Login successful!" });

    // Create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie
    response.cookies.set("token", token, {
      path: "/",
      httpOnly: true,
      // maxAge: 60 * 60 * 24
    });
    return response;
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
