import { Routes, Route } from "react-router-dom";
import RecLoginPage from "../Pages/recruiter/RecLoginPage";
import RecSignupPage from "../Pages/recruiter/RecSignupPage";
import RecOtp from "../Component/recruiter/auth/RecOtp"
import RecHome from "../Pages/recruiter/RecHome";
import NewJobPage from "../Pages/recruiter/NewJobPage";
import EditjobPage from "../Pages/user/EditjobPage";
import CandidatePage from "../Pages/recruiter/CandidatePage";
import ProfilePage from "../Pages/recruiter/ProfilePage";
import PrivateRouterRecruiter from "../utils/RouteRecruiter/PrivateRecruiter";
import PublicRouterRecruiter from "../utils/RouteRecruiter/PublicRecruiter";
import UserProfilePage from "../Pages/recruiter/UserProfilePage";
const RecruiterRoute=()=>{
    return(
        <Routes>
            <Route element={<PublicRouterRecruiter/>}>
            <Route path="/reclogin" element={<RecLoginPage/>}/>
            <Route path="/recsignup" element={<RecSignupPage/>}/>
            <Route path="/recOtp" element={<RecOtp/>}/>
            </Route>
            <Route element={<PrivateRouterRecruiter/>}>
            < Route path='/recHome' element={< RecHome />} />
            < Route path='/newjob' element={< NewJobPage />} />
            < Route path='/editjob/:id' element={< EditjobPage />} />
            < Route path='/candidates/:jobid' element={< CandidatePage />} />
            < Route path='/profile/:id' element={< ProfilePage />} />
            < Route path='/userprofile/:id' element={< UserProfilePage />} />
            </Route>
        </Routes>
        
        
    
    )
}

export default RecruiterRoute