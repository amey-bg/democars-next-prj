import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token1 = cookieStore.get("token");
    const response = NextResponse.json(
      { data: null, message: "User logged out successfully!" },
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Set-Cookie": `token=${token1.value}; Path=/; Max-Age=0`,
        },
      }
    );

    console.log("Logout API response =", response);

    //Clear / remove cookie
    response.cookies.set("token", null, { expires: new Date(Date.now()) });
    response.cookies.delete("token");

    return response;
  } catch (error) {
    return NextResponse.json(
      { data: null, message: error.message },
      { status: 500 }
    );
  }
}
