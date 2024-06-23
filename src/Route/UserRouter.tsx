import { Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/user/Login";
import SignupPage from "../Pages/user/Signup";
import Otp from "../Component/user/auth/Otp";
import Home from "../Component/user/home/Home";
import Job from "../Pages/user/Job";
import ProfilePage from "../Pages/user/ProfilePage";
import PublicRouterUser from "../utils/RouteUser/PublicUser";
import PrivateRouterUser from "../utils/RouteUser/PrivateUser";
import SingleJob from "../Component/user/home/SingleJob";
import SaveJobPage from "../Pages/user/SaveJobPage";

const UserRoutes = () => {
    return (
        < Routes >
                <Route element={<PublicRouterUser/>}>
                < Route path='/register' element={< SignupPage />} />
                < Route path='/otp' element={< Otp />} />
                < Route path='/' element={< LoginPage />} />
                
                </Route>
                <Route element={<PrivateRouterUser/>}>
                    < Route path='/home' element={< Home />} />
                    < Route path='/job' element={< Job />} />
                    < Route path='/profile/:id' element={< ProfilePage />} />
                    <Route path='/job/:id' element={<SingleJob/>}/>
                    <Route path='/saved-jobs' element={<SaveJobPage/>}/>
                </Route>
        </Routes >
        
    )
}
export default UserRoutes