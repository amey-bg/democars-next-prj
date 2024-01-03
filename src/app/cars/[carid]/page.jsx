import React from "react";
import axios from "axios";
import { cookies } from "next/headers";
import CarInformation from "@/components/carInfoComponents/CarInformation";

export async function getCar(id) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const response = await axios.get(`${process.env.DOMAIN}/api/cars/${id}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    // console.log(response);
    return response.data.data;
  } catch (error) {
    // console.log(error);
    throw error;
  }
}

async function CarInfo({ params }) {
  const car = await getCar(params.carid);
  return (
    car && (
      <div className="p-5">
        <CarInformation car={car} />
      </div>
    )
  );
}

export default CarInfo;
