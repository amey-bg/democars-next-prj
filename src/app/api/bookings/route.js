import { connectDB } from "@/config/dbConfig";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
import Booking from "@/models/bookingModel";
import { NextResponse } from "next/server";
const stripe = require("stripe")(
  "sk_test_51OSfqrSGVsjl2DONLQBxOKvGY64OI1brLTVZcve0PwUTnxqBwUAB3fhpl50on6QnKSmQOmuS48DLx2CzEdqvhf6m00rFXlP5kj"
);

connectDB();

export async function POST(request) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    const reqBody = await request.json();

    //Make payment process

    //Step 1: Create customer
    const customer = await stripe.customers.create({
      email: reqBody.email,
      source: reqBody.token.id,
    });

    //Step 2: Create charge
    //No longer supports Charges API now in india
    // const payment = await stripe.charges.create(
    //   {
    //     amount: reqBody.totalAmount * 100,
    //     currency: "usd",
    //     customer: customer.id,
    //     receipt_email: reqBody.email,
    //     description: `Booking for DemoCars...`,
    //   },
    //   {
    //     idempotencyKey: reqBody.token.id,
    //   }
    // );
    const payment = await stripe.paymentIntents.create(
      {
        amount: reqBody.totalAmount * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: reqBody.email,
        description: "Booking for DemoCars.",
        automatic_payment_methods: { enabled: true },
      },
      {
        idempotencyKey: reqBody.token.id,
      }
    );

    //Check payment and add payment id to request body...also add paymentId in Bookings Model
    reqBody.paymentId = payment.id;

    const response = await Booking.create(reqBody);
    // console.log("Booking Post API response =", response);
    return NextResponse.json({ message: "Booking added successfully!" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    await validateTokenAndGetUserId(request);
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user");
    let filters = {};
    if (user) {
      filters.user = user;
    }
    // console.log("user from search params = ", user);
    const bookings = await Booking.find(filters)
      .populate("car")
      .populate("user");
    // console.log("bookings in get bookings api = ", bookings);
    return NextResponse.json({ data: bookings });
  } catch (error) {
    // console.log("bookings api get error = ", error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
