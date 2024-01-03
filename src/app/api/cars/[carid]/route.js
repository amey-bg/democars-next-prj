import { connectDB } from "@/config/dbConfig";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
import Car from "@/models/carModel";
import { NextResponse } from "next/server";

connectDB();

// Get a car details
export async function GET(request, content) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    const car = await Car.findById(content.params.carid);
    return NextResponse.json({ data: car });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// Edit / Update a car
export async function PUT(request) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    const reqBody = await request.json();
    // const filter = { _id: reqBody._id };
    // const response = await Car.findByIdAndUpdate(filter, reqBody);
    const response = await Car.findByIdAndUpdate(reqBody._id, reqBody);
    // console.log("Updated car = ", response);
    return NextResponse.json({ message: "Car updated successfully!" });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// Delete a car
export async function DELETE(request, content) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    await Car.findByIdAndDelete(content.params.carid);
    return NextResponse.json({ message: "Car deleted successfully!" });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
