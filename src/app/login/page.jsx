"use client";
import { antdFieldValidation } from "@/helpers/validationHelpers";
import { Form, Button, message, Input } from "antd";
import Link from "next/link";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/loadersSlice";

function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  async function onFinish(values) {
    // console.log(values);
    try {
      dispatch(SetLoading(true));
      const response = await axios.post("/api/users/login", values);
      // console.log(response);
      message.success(response.data.message);
      router.push("/");
    } catch (error) {
      // console.log(error);
      message.error(error.response.data.message || error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-450 card p-5">
        <Form layout="vertical" onFinish={onFinish}>
          <h1 className="text-xl">Democars - Login</h1>
          <div className="divider"></div>

          <div className="flex flex-col gap-5">
            <Form.Item label="Email" name="email" rules={antdFieldValidation}>
              <Input type="email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={antdFieldValidation}
            >
              <Input type="password" />
              {/* <Input.Password /> */}
            </Form.Item>
            <Button type="primary" block htmlType="submit">
              Login
            </Button>
            <Link href="/register">Dont have an account? Register</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
