import { Outlet, Navigate } from "react-router-dom";

function PrivateRouterAdmin() {
  const adminToken = localStorage.getItem('adminToken');
  const isAuthenticated = adminToken ? true : false;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRouterAdmin;
