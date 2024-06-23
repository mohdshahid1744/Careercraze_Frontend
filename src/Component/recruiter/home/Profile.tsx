import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, AppBar, Toolbar, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { recruiterLogout } from '../../../Redux/Slice/recruiterSlice';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/solid';
import ProfileData from './ProfileDataModal';
function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [isProfileDataOpen, setIsProfileDataOpen] = useState(false);

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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'beige' }}>
      <AppBar position="static" sx={{ height: '85px', backgroundColor: 'white' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <img
              src='../../../Images/logo.png'
              alt="Logo"
              className="w-16 h-auto absolute"
              style={{ top: '10px', left: '50px' }}
            />
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleHome}>
                  <img src="../../../Images/Home.png" alt="Home Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Home</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} >
                  <img src="../../../Images/newjob.png" alt="New Job Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">New Job</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}>
                  <img src="../../../Images/message.png" alt="Message Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Message</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleLogout}>
                  <img src="../../../Images/logout.png" alt="Logout Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Logout</Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: 'white', padding: 3, borderRadius: 2, boxShadow: 3 }}>
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
