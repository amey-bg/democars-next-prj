"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Row, Col, Button, DatePicker, message } from "antd";
import axios from "axios";
import { SetLoading } from "@/redux/loadersSlice";
import StripeCheckout from "react-stripe-checkout";

const { RangePicker } = DatePicker;

function CarInformation({ car }) {
  const [fromSlot, setFromSlot] = useState(null);
  const [toSlot, setToSlot] = useState(null);
  const [isSlotAvailable, setIsSlotAvailable] = useState(false);
  const router = useRouter();
  const { currentUser } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const checkAvailability = async () => {
    // console.log("checkAvailability() called...");
    try {
      dispatch(SetLoading(true));
      const response = await axios.post("/api/checkAvailability", {
        car: car._id,
        fromSlot,
        toSlot,
      });
      if (response.data.success) {
        message.success("Slot Available");
        setIsSlotAvailable(true);
      } else {
        throw new Error("Slot not available");
      }
    } catch (error) {
      // console.log("checkAvailability Error =", error);
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const bookNow = async (token) => {
    // console.log(currentUser);
    const payload = {
      car: car._id,
      user: currentUser._id,
      fromSlot,
      toSlot,
      totalHours: moment(toSlot).diff(moment(fromSlot), "hours"),
      totalAmount:
        moment(toSlot).diff(moment(fromSlot), "hours") * car?.rentPerHour,
      token,
    };
    // console.log("Payload = ", payload);

    try {
      dispatch(SetLoading(true));
      const response = await axios.post("/api/bookings", payload);
      // console.log("bookNow response =", response);
      message.success(response.data.message);
      router.push("/profile");
    } catch (error) {
      // console.log("bookNow error =", error);
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    //If there is any change in the fromSlot or toSlot then make Booknow button disabled...
    setIsSlotAvailable(false);
    // console.log("Stripe key =", process.env.STRIPE_PUBLISHABLE_KEY);
  }, [fromSlot, toSlot]);

  return (
    <div>
      <Row justify="center">
        <Col span={16} className="card p-5">
          <h1 className="text-xl">{car?.name}</h1>
          <div className="flex justify-center my-3">
            <img
              src={car?.carImage}
              width="100%"
              height="auto"
              alt={car?.name}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>
                <b>Brand:</b>
              </span>
              <span>{car?.brand}</span>
            </div>

            <div className="flex justify-between">
              <span>
                <b>Fuel:</b>
              </span>
              <span>{car?.fuelType}</span>
            </div>

            <div className="flex justify-between">
              <span>
                <b>Seat Capacity:</b>
              </span>
              <span>{car?.seatingCapacity}</span>
            </div>

            <div className="flex justify-between">
              <span>
                <b>Rate / hour:</b>
              </span>
              <span>$ {car?.rentPerHour}</span>
            </div>

            <div className="divider"></div>
            <div className="flex justify-center items-center gap-5">
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                onChange={(value) => {
                  setFromSlot(value[0].toDate());
                  setToSlot(value[1].toDate());
                }}
                disabledDate={(current) => {
                  return current && current < moment().endOf("day");
                }}
              />
              <Button
                type="primary"
                title="Check Availability"
                disabled={!fromSlot || !toSlot}
                onClick={checkAvailability}
              >
                Check Availability
              </Button>
            </div>
            <div className="divider"></div>
            {fromSlot && toSlot && (
              <>
                <div className="flex justify-center gap-5">
                  <h1 className="text-md">
                    Total Hours :{" "}
                    {moment(toSlot).diff(moment(fromSlot), "hours")}
                  </h1>
                  |
                  <h1 className="text-md">
                    Total Amount : ${" "}
                    {moment(toSlot).diff(moment(fromSlot), "hours") *
                      car?.rentPerHour}
                  </h1>
                </div>
                <div className="divider"></div>
              </>
            )}
            <div className="flex justify-end gap-5">
              <Button type="default" title="Back" onClick={() => router.back()}>
                Back
              </Button>
              <StripeCheckout
                stripeKey="pk_test_51OSfqrSGVsjl2DON8dnwJzcWS3s5qQLqweJc6orgYsXSqKWo6b0nFpW83UppxQ5KsMarXlNey0OX5FiHirzv7TyO0031n2SjZ6"
                // token={(result) => {
                //   console.log(result);
                // }}
                token={bookNow}
                currency="USD"
                amount={
                  moment(toSlot).diff(moment(fromSlot), "hours") *
                  car?.rentPerHour *
                  100
                }
                shippingAddress
                key={process.env.STRIPE_PUBLISHABLE_KEY}
              >
                <Button
                  type="primary"
                  title="Book Now"
                  disabled={!fromSlot || !toSlot || !isSlotAvailable}
                  // onClick={bookNow}
                >
                  Book Now
                </Button>
              </StripeCheckout>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CarInformation;
