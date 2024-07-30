import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, AppBar, Toolbar, Button,Avatar } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import { recruiterLogout } from '../../../Redux/Slice/recruiterSlice';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/solid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ProfileData from './ProfileDataModal';
import { RootState } from '../../../Redux/Store/Store';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [isProfileDataOpen, setIsProfileDataOpen] = useState(false);
  const userId = useSelector((store: RootState) => store.recruiter.UserId);
  const loggedInUserId = useSelector((state: RootState) => state.user.UserId);
console.log("LOGINNN",loggedInUserId);
console.log("USERIDD",userId);


  const fetchUserProfile = async () => {
    try {
      const response = await axiosRecruiterInstance.get(`/recruiter/getrecruiter/${id}`);
      setUserDetails(response.data.response);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const handleLogout = () => {
    dispatch(recruiterLogout());
    localStorage.removeItem('recruiterToken');
    navigate('/recruiter/reclogin');
  };
  const handleProfile = () => {
    if (userId) {
      navigate(`/recruiter/profile/${userId}`);
    }
  }
  const handleHome = () => {
    navigate('/recruiter/recHome');
  };

  const handleUpdateProfile = () => {
    setIsProfileDataOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setIsModalOpen(true);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const response = await axiosRecruiterInstance.put(`/recruiter/updateProfile/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUserDetails((prevDetails: any) => ({
        ...prevDetails,
        avatar: response.data.job.avatar,
      }));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  const handleFollow = async () => {
    try {
      console.log("UserID INd",userId);
    console.log("ID INDYE",id)
      
      
      let response=await axiosRecruiterInstance.get(`/recruiter/follow/${userId}/${id}`)
      console.log("RESSSS",response);
      
      fetchUserProfile();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosRecruiterInstance.get(`/recruiter/unfollow/${userId}/${id}`);
      fetchUserProfile(); 
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'beige' }}>
      
      <Box sx={{ padding: 4 }}>
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {userDetails && (
            <>
              <div className="relative">
                <img
                  src={userDetails.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full mb-2 border-2 border-white"
                />
                <PlusCircleIcon
                  className="w-5 h-5 absolute bottom-0 right-0 text-green-500 bg-white rounded-full border-2 border-white cursor-pointer"
                  onClick={() => document.getElementById('avatarInput')?.click()}
                />
                <input
                  type="file"
                  id="avatarInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
              <Typography variant="h5" sx={{ marginBottom: 1 }}>{userDetails.name}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Email: {userDetails.email}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Mobile: {userDetails.mobile}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Company Name: {userDetails.companyName}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>Company Email: {userDetails.companyEmail}</Typography>
              <PencilIcon
                className="w-6 h-6 ml-2 text-gray-500 cursor-pointer"
                onClick={handleUpdateProfile}
              />
                       <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-around' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleOutlineIcon sx={{ mr: 1, color: 'black' }} />
              <Typography variant="subtitle1" sx={{ mr: 1 }}>
                Following
              </Typography>
              <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24, fontSize: '0.8rem' }}>
                {userDetails?.following.length || 0}
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonAddIcon sx={{ mr: 1, color: 'black' }} />
              <Typography variant="subtitle1" sx={{ mr: 1 }}>
                Followers
              </Typography>
              <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24, fontSize: '0.8rem' }}>
                {userDetails?.followers.length || 0}
              </Avatar>
            </Box>
          </Box>
    {id !== userId && id !== loggedInUserId && (
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              {userDetails?.followers.includes(userId) ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddAlt1Icon />}
                  onClick={handleUnfollow}
                  sx={{ textTransform: 'none', boxShadow: 3 }}
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddAlt1Icon />}
                  onClick={handleFollow}
                  sx={{ textTransform: 'none', boxShadow: 3 }}
                >
                  Follow
                </Button>
              )}
            </Box>
          )}
            </>
          )}
        </Box>
        {isModalOpen && (
          <div>
            <button onClick={handleFileUpload}>Upload Avatar</button>
          </div>
        )}
      </Box>
      <ProfileData
        open={isProfileDataOpen}
        onClose={() => setIsProfileDataOpen(false)}
        fetchProfileData={fetchUserProfile}
        userDetails={userDetails}
        userId={id ?? ''} 
      />
    </Box>
  );
}

export default Profile;
