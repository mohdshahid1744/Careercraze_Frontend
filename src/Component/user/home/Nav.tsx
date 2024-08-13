import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Grid, Button, Drawer, IconButton, List, ListItem, ListItemText, useMediaQuery,ListItemIcon,Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { userLogout } from '../../../Redux/Slice/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/Store/Store';
import { Theme } from '@mui/material/styles';
import { axiosUserInstance } from '../../../utils/axios/Axios';
import socket from '../../../utils/Socket/Soket';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { keyframes } from '@emotion/react';
const clickAnimation = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

function Nav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.UserId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    handleDrawerToggle();
    setTimeout(() => setIsAnimating(false), 300); 
  };

  const handleHome = () => navigate('/home');
  const handleJob = () => navigate('/job');
  const handleSavedJob = () => navigate('/saved-jobs');
  const handleProfile = () => userId && navigate(`/profile/${userId}`);
  const handleChat = () => navigate('/chat');
  const handleLogout = async() => {
    dispatch(userLogout());
    localStorage.removeItem('userToken');
    await axiosUserInstance.post('/logout',{userId})
    socket.emit('logout', userId);
    navigate('/');
  };

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const menuItems = (
    <List>
      <ListItem button onClick={handleHome} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button onClick={handleJob} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
        <ListItemIcon>
          <WorkIcon />
        </ListItemIcon>
        <ListItemText primary="Job" />
      </ListItem>
      <ListItem button onClick={handleSavedJob} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
        <ListItemIcon>
          <BookmarkIcon />
        </ListItemIcon>
        <ListItemText primary="Saved Jobs" />
      </ListItem>
      <ListItem button onClick={handleChat} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary="Messages" />
      </ListItem>
      <ListItem button onClick={handleProfile} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem button onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
      <Divider />
    </List>
  );

  return (
    <>
      <AppBar position="static" sx={{ height: '85px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <img
              src='../../../Images/logo.png'
              alt="Logo"
              className="w-16 h-auto absolute"
              style={{ top: '10px', left: '50px' }}
            />
          </Typography>
          {isSmallScreen ? (
        <IconButton
          edge="start"
          color="primary"
          aria-label="menu"
          onClick={handleClick}
          sx={{
            zIndex: 1300,
            position: 'relative',
            transition: 'color 0.3s ease',
            animation: isAnimating ? `${clickAnimation} 0.3s` : 'none',
            '&:hover': {
              color: '#ff5722', 
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )  : (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center',marginLeft:'750px' }} >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Button sx={{ color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleHome}>
                    <img src="../../../Images/Home.png" alt="Home Icon" style={{ width: '30px', height: '30px' }} />
                    <Typography variant="caption">Home</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Button sx={{ color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleJob}>
                    <img src="../../../Images/Job.png" alt="Job Icon" style={{ width: '30px', height: '30px' }} />
                    <Typography variant="caption">Job</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Button sx={{ color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleSavedJob}>
                    <img src="../../../Images/savejob.png" alt="Save Job Icon" style={{ width: '30px', height: '30px' }} />
                    <Typography variant="caption">Save Job</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Button sx={{ color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleChat}>
                    <img src="../../../Images/message.png" alt="Message Icon" style={{ width: '30px', height: '30px' }} />
                    <Typography variant="caption">Message</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Button sx={{ color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleProfile}>
                    <img src="../../../Images/Profile.png" alt="Profile Icon" style={{ width: '30px', height: '30px' }} />
                    <Typography variant="caption">Me</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Button sx={{ color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleLogout}>
                    <img src="../../../Images/logout.png" alt="Logout Icon" style={{ width: '30px', height: '30px' }} />
                    <Typography variant="caption">Logout</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          <List>
            {menuItems}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Nav;
