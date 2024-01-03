import React, { useState, useEffect } from "react";
import { Select, Table, message } from "antd";
import { useDispatch } from "react-redux";
import axios from "axios";
import { SetLoading } from "@/redux/loadersSlice";
import moment from "moment";

function Users() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get("/api/users");
      // console.log(response.data);
      setUsers(response.data.data);
    } catch (error) {
      // console.log(error);
      message.error(error.message);
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const onUserUpdate = async (id, isActive) => {
    try {
      dispatch(SetLoading(true));
      await axios.put(`/api/users/${id}`, { isActive });
      message.success("User updated successfully!");
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD/MM/YYYY hh:mm A"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      render: (updatedAt) => moment(updatedAt).format("DD/MM/YYYY hh:mm A"),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive, record) => (
        <select
          value={isActive}
          onChange={(e) => onUserUpdate(record._id, e.target.value)}
        >
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={users} columns={columns} rowKey="_id" />
    </div>
  );
}

export default Users;
