"use client";
import store from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";

function ReduxStoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxStoreProvider;
