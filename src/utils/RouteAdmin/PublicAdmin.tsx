import { Outlet, Navigate } from "react-router-dom";

function PublicRouterAdmin() {
  const adminToken = localStorage.getItem('adminToken');
  const isAuthenticated = adminToken ? true : false;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/admin/home" />;
}

export default PublicRouterAdmin;
