import { Navigate, Outlet } from "react-router-dom";

const ProtectRoutes = () => {
  const token = localStorage.getItem("refreshToken");

  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectRoutes;
