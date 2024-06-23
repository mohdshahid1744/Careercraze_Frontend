import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../Pages/admin/Home';
import UserManagement from '../Pages/admin/UserManagement';
import Login from '../Pages/user/Login'
import PrivateRouterAdmin from '../utils/RouteAdmin/PrivateAdmin';
import PublicRouterAdmin from '../utils/RouteAdmin/PublicAdmin';
import RecruiterManagement from "../Component/admin/RecruiterManagement";
function AdminRouter() {
  return (
    <div>
      <Routes>
        
        <Route element={<PrivateRouterAdmin/>}>
      <Route path='/dashboard' element={<Home />} />
      <Route path='/user' element={<UserManagement />} />
      <Route path='/recruiter' element={<RecruiterManagement />} />
      </Route>
      </Routes>
    </div>
  )
}

export default AdminRouter
