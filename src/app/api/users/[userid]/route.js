import { connectDB } from "@/config/dbConfig";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectDB();

// Edit / Update a user
export async function PUT(request, { params }) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    const reqBody = await request.json();
    console.log("reqBody in update user api =", reqBody);
    // const filter = { _id: reqBody._id };
    // const response = await Car.findByIdAndUpdate(filter, reqBody);

    //Check if user is updating password
    if (reqBody.password) {
      // Hashed new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(reqBody.password, salt);
      reqBody.password = hashedPassword;
    }

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
