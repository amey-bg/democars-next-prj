import React from "react";
import { antdFieldValidation } from "@/helpers/validationHelpers";
import { Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "@/redux/loadersSlice";
import axios from "axios";
import { SetCurrentUser } from "@/redux/usersSlice";

function General() {
  const { currentUser } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    // console.log(values);
    try {
      dispatch(SetLoading(true));
      if (values.password === values.confirmPassword) {
        const res = await axios.put(`/api/users/${currentUser._id}`, values);
        dispatch(SetCurrentUser(res.data.data));
        message.success("Profile updated successfully");
      } else {
        message.error("Passwords do not match");
      }
    } catch (error) {
      message.error(error.response.data.message || error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  return (
    <div>
      <div className="w-450">
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ name: currentUser.name, email: currentUser.email }}
        >
          <div className="flex flex-col gap-5">
            <Form.Item label="Name" name="name" rules={antdFieldValidation}>
              <Input type="text" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={antdFieldValidation}>
              <Input type="email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={antdFieldValidation}
            >
              <Input type="password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={antdFieldValidation}
            >
              <Input type="password" />
            </Form.Item>
            <Button type="primary" block htmlType="submit">
              Update Profile
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default General;
