"use client";
// import AllBookings from "@/components/profileComponents/AllBookings";
import Cars from "@/components/profileComponents/Cars";
import General from "@/components/profileComponents/General";
// import UserBookings from "@/components/profileComponents/UserBookings";
import BookingsTable from "@/components/profileComponents/BookingsTable";
import Users from "@/components/profileComponents/Users";
import { Tabs } from "antd";
import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.users);
  return (
    currentUser && (
      <div className="p-5">
        <Tabs defaultActiveKey="1">
          {/* Tabs for Normal User */}
          {currentUser.isAdmin === false && (
            <>
              <Tabs.TabPane tab="General" key="1">
                <General />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Bookings" key="2">
                <BookingsTable />
              </Tabs.TabPane>
            </>
          )}

          {/* Tabs for Admin User */}
          {currentUser.isAdmin && (
            <>
              <Tabs.TabPane tab="General" key="1">
                <General />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Cars" key="2">
                <Cars />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Users" key="3">
                <Users />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Bookings" key="4">
                <BookingsTable />
              </Tabs.TabPane>
            </>
          )}
        </Tabs>
        {/* <h1 className="text-xl">Welcome {currentUser?.name}</h1> */}
      </div>
    )
  );
}

export default Profile;
