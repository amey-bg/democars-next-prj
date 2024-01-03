"use client";
import { antdFieldValidation } from "@/helpers/validationHelpers";
import { Form, Input, Button, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/loadersSlice";

function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  async function onFinish(values) {
    // console.log(values);

    try {
      dispatch(SetLoading(true));
      const response = await axios.post("/api/users/register", values);
      // console.log(response);
      message.success(response.data.message);
      router.push("/login");
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
          <h1 className="text-xl">Democars - Register</h1>
          <div className="divider"></div>

          <div className="flex flex-col gap-5">
            <Form.Item
              label="Name"
              name="name"
              // rules={[
              //   {
              //     required: true,
              //     message: "Required",
              //   },
              // ]}
              rules={antdFieldValidation}
            >
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
            <Button type="primary" block htmlType="submit">
              Register
            </Button>
            <Link href="/login">Already have an account? Login</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
