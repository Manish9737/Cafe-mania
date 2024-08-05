import React from "react";
import { Outlet } from "react-router-dom";
import CustomNavbar from "./CustomNavbar";

const Layout = () => {
  return (
    <>
      <CustomNavbar />
      <Outlet />
    </>
  );
};

export default Layout;
