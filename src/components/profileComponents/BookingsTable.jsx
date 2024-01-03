import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Modal, Table, message } from "antd";
import { SetLoading } from "@/redux/loadersSlice";
import moment from "moment";

function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      let url = "/api/bookings";
      if (!currentUser.isAdmin) {
        url = `/api/bookings?user=${currentUser._id}`;
      }
      const response = await axios.get(url);
      setBookings(response.data.data);
    } catch (error) {
      // console.log("User bookings error =", error);
      message.error(error.response.data.message || error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const onCancel = async () => {
    try {
      dispatch(SetLoading(true));
      await axios.put(`/api/bookings/${selectedBooking._id}`, {
        status: "cancelled",
      });
      message.success("Booking cancelled successfully!");
      setShowCancelModal(false);
      getData();
    } catch (error) {
      // console.log("User bookings cancel error =", error);
      message.error(error.response.data.message || error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    // console.log("UserBookings comp loaded");
    getData();
  }, []);

  const columns = [
    {
      title: "Booking Id",
      dataIndex: "_id",
    },
    {
      title: "User",
      dataIndex: "user",
      render: (user) => user.name,
    },
    {
      title: "Car",
      dataIndex: "car",
      render: (car) => car.name,
    },
    {
      title: "Tot Hours",
      dataIndex: "totalHours",
    },
    {
      title: "Tot Amount",
      dataIndex: "totalAmount",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => status.toUpperCase(),
    },
    {
      title: "From Slot",
      dataIndex: "fromSlot",
      render: (fromSlot) => moment(fromSlot).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "To Slot",
      dataIndex: "toSlot",
      render: (toSlot) => moment(toSlot).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Actions",
      render: (record) => (
        <div>
          {record.status === "approved" && (
            <span
              className="underline"
              onClick={() => {
                setSelectedBooking(record);
                setShowCancelModal(true);
              }}
            >
              Cancel
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={bookings} columns={columns} rowKey="_id" />

      {showCancelModal && (
        <Modal
          open={showCancelModal}
          onCancel={() => setShowCancelModal(false)}
          title="Cancel Booking"
          okText="Cancel Booking"
          cancelText="Close"
          onOk={onCancel}
        >
          <div className="flex flex-col gap-5">
            <span>
              Are you sure you want to cancel booking with id{" "}
              {selectedBooking._id} ?
            </span>

            <span>
              <b>Note: </b> Only the booking will be cancelled, the amount will
              not be refunded online. You will have to contact the admin for a
              refund.
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default BookingsTable;
