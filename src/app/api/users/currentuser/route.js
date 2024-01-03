import { connectDB } from "@/config/dbConfig";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

connectDB();

export async function GET(req) {
  try {
    const userId = await validateTokenAndGetUserId(req);
    const user = await User.findById(userId).select("-password");
    // console.log(user);
    return NextResponse.json(
      { data: user, message: "Current user fetched successfully!" },
      { status: 200 }
    );
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      { data: null, message: error.message },
      { status: 500 }
    );
  }
}
