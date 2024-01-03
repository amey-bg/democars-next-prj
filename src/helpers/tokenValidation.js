import jwt from "jsonwebtoken";

export async function validateTokenAndGetUserId(request) {
  const token = request.cookies.get("token")?.value;
  try {
    if (!token) {
      throw new Error("No token found!");
    }

    // Verify token
    // verify method will return an object whatever you have encrypted..
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;
    return userId;
  } catch (error) {
    return error;
  }
}
