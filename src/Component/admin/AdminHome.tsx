import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../Redux/Slice/adminSlice';
import axios from 'axios';
import { axiosRecruiterInstance } from '../../utils/axios/Axios';
import { axiosUserInstance } from '../../utils/axios/Axios';
import LogoutIcon from '@mui/icons-material/Logout';
function AdminHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [recruiterCount, setRecruiterCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userResponse, recruiterResponse] = await Promise.all([
            axiosUserInstance.get('/usercount'),
          axiosRecruiterInstance.get('/recruiter/count'), 
        ]);
        setUserCount(userResponse.data.count);
        setRecruiterCount(recruiterResponse.data.count);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const handleLogout = () => {
    dispatch(adminLogout());
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const menuItems = [
    { text: 'Dashboard', onClick: () => navigate('/admin/dashboard') },
    { text: 'User', onClick: () => navigate('/admin/user') },
    { text: 'Recruiter', onClick: () => navigate('/admin/recruiter') },
    { text: 'Skill', onClick: () => navigate('/admin/skill') },
    { text: 'Post', onClick: () => navigate('/admin/post') },
  ];

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Drawer
        variant="permanent"
        className="w-60"
        classes={{ paper: 'w-60 box-border' }}
      >
        <Toolbar />
        <div className="overflow-auto">
          <List>
            {menuItems.map((item, index) => (
              <ListItem  key={index} onClick={item.onClick}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <div className="flex flex-col flex-grow">
        <AppBar position="static" className="bg-gray-800 w-full">
          <Toolbar>
            <Typography variant="h6" className="flex-grow">
              Admin Dashboard
            </Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box className="flex flex-col items-center justify-center p-4">
          <Box
            className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-lg mt-4"
          >
            <Typography variant="h4" component="h1" gutterBottom>
              ADMIN
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Box
                  className="bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <Typography variant="h6">Users</Typography>
                  <Typography variant="body1">{userCount}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  className="bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <Typography variant="h6">Recruiters</Typography>
                  <Typography variant="body1">{recruiterCount}</Typography>
                </Box>
              </Grid>
            </Grid>
          
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default AdminHome;
