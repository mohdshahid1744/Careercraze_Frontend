import { Outlet, Navigate } from "react-router-dom";

function PrivateRouterRecruiter() {
    const recruiterToken = localStorage.getItem('recruiterToken');
    const isAuthenticated = recruiterToken ? true : false;
    return isAuthenticated ? <Outlet /> : <Navigate to="/recruiter/recLogin" />;
}

export default PrivateRouterRecruiter