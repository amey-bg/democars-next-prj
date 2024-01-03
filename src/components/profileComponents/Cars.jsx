import React, { useState, useEffect } from "react";
import { Button, Table, message } from "antd";
import CarForm from "./CarForm";
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/loadersSlice";
import axios from "axios";

function Cars() {
  const [showCarFormModal, setShowCarFormModal] = useState(false);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const dispatch = useDispatch();

  async function getData() {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get("/api/cars");
      setCars(response.data.data);
    } catch (error) {
      // console.log(error);
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  }

  const deleteCar = async (carid) => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.delete(`/api/cars/${carid}`);
      message.success(response.data.message);
      getData();
    } catch (error) {
      // console.log(error);
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Car Image",
      dataIndex: "carImage",
      render: (carImage) => (
        <img src={carImage} alt="car" height="80" width="auto" />
      ),
    },
    {
      title: "Car Name",
      dataIndex: "name",
    },
    {
      title: "Car Brand",
      dataIndex: "brand",
    },
    {
      title: "Fuel Type",
      dataIndex: "fuelType",
    },
    {
      title: "Rent/Hour",
      dataIndex: "rentPerHour",
    },
    {
      title: "Seats",
      dataIndex: "seatingCapacity",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="flex gap-5">
          <i
            className="ri-edit-2-line cursor-pointer"
            onClick={() => {
              setSelectedCar(record);
              setShowCarFormModal(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-6-line cursor-pointer"
            onClick={() => {
              deleteCar(record._id);
            }}
          ></i>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => {
            setSelectedCar(null);
            setShowCarFormModal(true);
          }}
        >
          Add Car
        </Button>
      </div>

      <Table dataSource={cars} columns={columns} rowKey="_id" />

      {showCarFormModal && (
        <CarForm
          showCarFormModal={showCarFormModal}
          setShowCarFormModal={setShowCarFormModal}
          selectedCar={selectedCar}
          reloadData={getData}
        />
      )}
    </div>
  );
}

export default Cars;
