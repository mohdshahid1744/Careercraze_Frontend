import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../Pages/admin/Home';
import UserManagement from '../Pages/admin/UserManagement';
import Login from '../Pages/user/Login'
import PrivateRouterAdmin from '../utils/RouteAdmin/PrivateAdmin';
import PublicRouterAdmin from '../utils/RouteAdmin/PublicAdmin';
import RecruiterManagement from "../Component/admin/RecruiterManagement";
import SkillManagement from '../Component/admin/SkillManagement';
import PostManagement from '../Component/admin/PostManagement';
function AdminRouter() {
  return (
    <div>
      <Routes>
        
        <Route element={<PrivateRouterAdmin/>}>
      <Route path='/dashboard' element={<Home />} />
      <Route path='/user' element={<UserManagement />} />
      <Route path='/recruiter' element={<RecruiterManagement />} />
      <Route path='/skill' element={<SkillManagement />} />
      <Route path='/post' element={<PostManagement />} />
      </Route>
      </Routes>
    </div>
  )
}

export default AdminRouter
