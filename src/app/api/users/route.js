import { connectDB } from "@/config/dbConfig";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
// import Booking from "@/models/bookingModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
connectDB();

export async function GET(request) {
  try {
    await validateTokenAndGetUserId(request);
    const users = await User.find();
    // console.log("users in get users api = ", users);
    return NextResponse.json({ data: users });
  } catch (error) {
    // console.log("users api get error = ", error);
    return NextResponse.json(
      { message: error.message, error },
      { status: 400 }
    );
  }
}
