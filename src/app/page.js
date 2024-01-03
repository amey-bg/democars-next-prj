import { cookies } from "next/headers";
import axios from "axios";
import CarsGrid from "@/components/homeComponents/CarsGrid";

// export async function getCurrentUser() {
//   // console.log("getCurrentUser");
//   try {
//     const cookieStore = cookies();
//     const token = cookieStore.get("token").value;
//     const response = await axios.get(
//       `${process.env.DOMAIN}/api/users/currentuser`,
//       {
//         headers: {
//           //The below value is important and that is how you can send cookie to server and server can read it.
//           Cookie: `token=${token}`,
//         },
//       }
//     );
//     console.log(response);
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }

export async function getCars() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const response = await axios.get(`${process.env.DOMAIN}/api/cars`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    // console.log(error);
    throw error;
  }
}

export default async function Home() {
  // const currentUser = await getCurrentUser();
  const cars = await getCars();
  // console.log("Home");
  return (
    <div className="p-5">
      <CarsGrid cars={cars} />
      {/* {currentUser && (
        <h2>
          Sign in as {currentUser.name} {" - "} {currentUser.email}
        </h2>
      )} */}
    </div>
  );
}
