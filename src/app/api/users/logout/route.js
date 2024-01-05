import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { data: null, message: "User logged out successfully!" },
      { status: 200 }
    );

    console.log("Logout API response =", response);

    //Clear / remove cookie
    response.cookies.set("token", "", { expires: new Date(Date.now()) });
    response.cookies.delete("token");

    return response;
  } catch (error) {
    return NextResponse.json(
      { data: null, message: error.message },
      { status: 500 }
    );
  }
}
