import { Navigate, Outlet } from "react-router-dom";

const UserPrivateRoute = ({ children, ...rest }) => {
  const userToken = localStorage.getItem("userToken");

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default UserPrivateRoute;
