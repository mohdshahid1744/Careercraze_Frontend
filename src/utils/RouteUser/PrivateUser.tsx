import { Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { axiosUserInstance } from "../axios/Axios";
import { RootState } from '../../Redux/Store/Store';
import { useSelector } from 'react-redux';
function PrivateRouterUser() {
    const [isActive, setIsActive] = useState(true); 
    const userToken = localStorage.getItem('userToken');
    const isAuthenticated = userToken !== null && isActive;
    console.log("ISSSA",isAuthenticated);
    
    const email = useSelector((state: RootState) => state.user.userEmail);
    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const response = await axiosUserInstance.get(`/userstatus/${email}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
                console.log("READAS",response);
                
                const userData = response.data;
                setIsActive(userData.isActive);
            } catch (error) {
                console.error('Error fetching user status:', error);
                setIsActive(false);
            }
        };

        if (userToken) {
            fetchUserStatus();
        } else {
            setIsActive(false); 
        }
    }, [userToken]);

    useEffect(() => {
        if (!isActive) {
            localStorage.removeItem('userToken'); 
        }
    }, [isActive]);

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRouterUser;
