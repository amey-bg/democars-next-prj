import { connectDB } from "@/config/dbConfig";
import { NextResponse } from "next/server";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
import Booking from "@/models/bookingModel";

connectDB();

export async function POST(request) {
  try {
    let slotAvailable = true;
    const { fromSlot, toSlot, car } = await request.json();

    //Check if car is available for the given time slot
    //Case 1: New booking from-slot or to-slot is between existing booking from-slot and to-slot.
    const bookings = await Booking.find({
      car: car,
      status: "approved",
      $or: [
        { fromSlot: { $gte: fromSlot, $lte: toSlot } },
        { toSlot: { $gte: fromSlot, $lte: toSlot } },
        { fromSlot: { $lte: fromSlot }, toSlot: { $gte: toSlot } },
        {
          toSlot: { $gte: fromSlot, $lte: toSlot },
          fromSlot: { $lte: fromSlot },
        },
      ],
    });
    if (bookings.length > 0) {
      slotAvailable = false;
    }

    return NextResponse.json({ success: slotAvailable, bookings });
  } catch (error) {
    // console.log("API checkAvailablity error=", error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
