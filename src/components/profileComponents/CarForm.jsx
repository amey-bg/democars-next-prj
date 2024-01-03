import React from "react";
import { antdFieldValidation } from "@/helpers/validationHelpers";
import { SetLoading } from "@/redux/loadersSlice";
import { Col, Form, Input, Modal, Row, message } from "antd";
import { useDispatch } from "react-redux";
import axios from "axios";

function CarForm({
  showCarFormModal,
  setShowCarFormModal,
  selectedCar,
  reloadData,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  async function onFinish(values) {
    // console.log("Car form =", values);
    try {
      dispatch(SetLoading(true));
      let response = null;

      if (selectedCar) {
        values._id = selectedCar._id;
        response = await axios.put(`/api/cars/${selectedCar._id}`, values);
      } else {
        response = await axios.post("/api/cars", values);
      }
      // console.log(response);
      reloadData();
      message.success(response.data.message);
      setShowCarFormModal(false);
    } catch (error) {
      // console.log("Car Form error=", error);
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  }
  return (
    <Modal
      open={showCarFormModal}
      onCancel={() => setShowCarFormModal(false)}
      centered
      okText="Save"
      onOk={() => {
        form.submit();
      }}
    >
      <h1 className="text-center text-xl">
        {selectedCar ? "Edit a Car" : "Add a Car"}
      </h1>

      <Form
        layout="vertical"
        className="flex flex-col gap-5"
        onFinish={onFinish}
        form={form}
        initialValues={selectedCar}
      >
        <Form.Item label="Name" name="name" rules={antdFieldValidation}>
          <Input type="text" />
        </Form.Item>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Brand" name="brand" rules={antdFieldValidation}>
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Fuel Type"
              name="fuelType"
              rules={antdFieldValidation}
            >
              <select>
                <option value="">Select Fuel Type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Rent Per Hour"
              name="rentPerHour"
              rules={antdFieldValidation}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Seating Capacity"
              name="seatingCapacity"
              rules={antdFieldValidation}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Car Image"
          name="carImage"
          rules={antdFieldValidation}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CarForm;
