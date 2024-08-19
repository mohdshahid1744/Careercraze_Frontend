import { Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/user/Login";
import SignupPage from "../Pages/user/Signup";
import Otp from "../Component/user/auth/Otp";
import HomePage from "../Pages/user/HomePage";
import Job from "../Pages/user/Job";
import ProfilePage from "../Pages/user/ProfilePage";
import PublicRouterUser from "../utils/RouteUser/PublicUser";
import PrivateRouterUser from "../utils/RouteUser/PrivateUser";
import SingleJob from "../Component/user/home/SingleJob";
import SaveJobPage from "../Pages/user/SaveJobPage";
import ChatPage from "../Pages/user/ChatPage";
import RecruiterProfile from "../Pages/user/RecruiterProfile";
import Videocall from "../Component/user/home/Videocall";
import AppliedJobsPage from "../Pages/user/AppliedJobsPage";
import PageNotFound from "../Component/user/home/PageNotFound";
const UserRoutes = () => {
    return (
        < Routes >
                <Route element={<PublicRouterUser/>}>
                < Route path='/register' element={< SignupPage />} />
                < Route path='/otp' element={< Otp />} />
                < Route path='/' element={< LoginPage />} />
                
                </Route>
                <Route element={<PrivateRouterUser/>}>
                    < Route path='/home' element={< HomePage />} />
                    < Route path='/job' element={< Job />} />
                    < Route path='/profile/:id' element={< ProfilePage />} />
                    <Route path='/job/:id' element={<SingleJob/>}/>
                    <Route path='/saved-jobs' element={<SaveJobPage/>}/>
                    <Route path='/chat' element={<ChatPage/>}/>
                    <Route path='/recProfile/:id' element={<RecruiterProfile/>}/>
                    <Route path='/video' element={<ChatPage/>}/>
                    <Route path='/appliedjobs' element={<AppliedJobsPage/>}/>
                </Route>
                <Route path='/*' element={<PageNotFound />} />
        </Routes >
        
    )
}
export default UserRoutes