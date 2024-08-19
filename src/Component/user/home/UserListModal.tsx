import React, { useEffect, useState } from 'react';
import { axiosUserInstance } from '../../../utils/axios/Axios';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    userIds: string[];
    title: string;
}

interface UserDetails {
    name: string;
    avatar: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, userIds, title }) => {
    const [userDetails, setUserDetails] = useState<UserDetails[]>([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (userIds.length > 0) {
                try {
                    const responses = await Promise.all(userIds.map(id => axiosUserInstance.get(`/getuser/${id}`)));
                    const fetchedUserDetails = responses.map(response => {
                        const userResponse = response.data.response;
                        if (userResponse) {
                            const { name, avatar } = userResponse;
                            return { name, avatar };
                        } else {
                            return { name: 'Unknown', avatar: '' };
                        }
                    });
                    setUserDetails(fetchedUserDetails);
                    console.log("Fetched user details:", fetchedUserDetails);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            } else {
                setUserDetails([]);
            }
        };
    
        fetchUserDetails();
    }, [userIds]);
    

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/2">
                <button className="float-right" onClick={onClose}>Close</button>
                <h2 className="text-xl font-bold">{title}</h2>
                <ul>
                    {userDetails.map((user, index) => (
                        <li key={index} className="p-2 border-b border-gray-200 flex">
                            <img src={user.avatar} alt="" className='w-8 mr-2 rounded-full' />
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Modal;
