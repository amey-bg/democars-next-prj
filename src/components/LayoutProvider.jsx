"use client";
import React, { useState, useEffect } from "react";

import { ConfigProvider, message } from "antd";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "@/redux/usersSlice";
import { SetLoading } from "@/redux/loadersSlice";
import Spinner from "./Spinner";

function LayoutProvider({ children }) {
  const { currentUser } = useSelector((state) => state.users);
  const { loading } = useSelector((state) => state.loaders);
  // console.log(currentUser);
  // const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  async function getCurrentUser() {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get("/api/users/currentuser");
      // console.log(response);
      // setUser(response.data.data);
      dispatch(SetCurrentUser(response.data.data));
    } catch (error) {
      message.error(error.response.data.message || error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  }

  async function onLogout() {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get("/api/users/logout");
      console.log("onLogout() response =", response);
      message.success("User logged out successfully!");
      router.push("/login");
    } catch (error) {
      message.error(error.response.data.message || error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  }

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/register") {
      getCurrentUser();
    }
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body>
        {loading && <Spinner />}
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#000",
            },
          }}
        >
          <div className="header bg-primary p-5 flex justify-between items-center">
            <h1
              className="text-xl text-white cursor-pointer"
              onClick={() => router.push("/")}
            >
              DemoCarsRental
            </h1>
            {pathname !== "/login" && pathname !== "/register" && (
              <div className="flex gap-5 items-center">
                <h4
                  className="text-md text-white underline"
                  onClick={() => router.push("/profile")}
                >
                  {currentUser?.name}
                  {/* {user?.name} */}
                </h4>
                <i
                  className="ri-logout-circle-r-line text-white"
                  onClick={onLogout}
                ></i>
              </div>
            )}
          </div>
          <div>{children}</div>
        </ConfigProvider>
      </body>
    </html>
  );
}

export default LayoutProvider;
