import { connectDB } from "@/config/dbConfig";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

connectDB();

// Edit / Update a user
export async function PUT(request, { params }) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    const reqBody = await request.json();
    // const filter = { _id: reqBody._id };
    // const response = await Car.findByIdAndUpdate(filter, reqBody);
    const response = await User.findByIdAndUpdate(params.userid, reqBody, {
      new: true,
    });
    // console.log("Updated user = ", response);
    return NextResponse.json({
      message: "User updated successfully!",
      data: response,
    });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
