import { Outlet, Navigate } from "react-router-dom";
function PublicRouterRecruiter() {
    const recruiterToken = localStorage.getItem('recruiterToken');
    const isAuthenticated = recruiterToken ? true : false;
    return isAuthenticated ?<Navigate to="/recruiter/recHome" />: <Outlet /> 
}

export default PublicRouterRecruiter