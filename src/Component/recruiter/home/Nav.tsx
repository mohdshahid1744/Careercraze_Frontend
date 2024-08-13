import React, {useState} from 'react';
import { Box, Typography, Grid, AppBar, Toolbar, Button ,useMediaQuery,IconButton,Drawer,List,ListItem,ListItemText} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { Theme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import { recruiterLogout } from '../../../Redux/Slice/recruiterSlice';
import { RootState } from '../../../Redux/Store/Store';
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((store: RootState) => store.recruiter.UserId);
  const handleHome = () => {
    navigate('/recruiter/recHome');
  };
  const handleLogout = () => {
    dispatch(recruiterLogout());
    localStorage.removeItem('recruiterToken');
    navigate('/recruiter/recLogin');
  };
  const handleNewJob = () => {
    navigate('/recruiter/newjob');
  };
  const handleProfile = () => {
    if (userId) {
      navigate(`/recruiter/profile/${userId}`);
    }
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const [isAnimating, setIsAnimating] = useState(false);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleClick = () => {
    setIsAnimating(true);
    handleDrawerToggle();
    setTimeout(() => setIsAnimating(false), 300); 
  };

  const menuItems = (
    <>
      <ListItem button onClick={handleHome}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button onClick={handleNewJob}>
        <ListItemText primary="New Job" />
      </ListItem>
      <ListItem button onClick={handleProfile}>
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem button onClick={handleLogout}>
        <ListItemText primary="Logout" />
      </ListItem>
    </>
  );
  return (
    <>
   <AppBar position="static" sx={{ height: '85px', backgroundColor: 'white' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <img
            src="../../../Images/logo.png"
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
      ):(
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                sx={{
                  color: 'black',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'none',
                }}
                onClick={handleHome}
              >
                <img
                  src="../../../Images/Home.png"
                  alt="Home Icon"
                  style={{ width: '30px', height: '30px' }}
                />
                <Typography variant="caption">Home</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{
                  color: 'black',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'none',
                }}
                onClick={handleNewJob}
              >
                <img
                  src="../../../Images/newjob.png"
                  alt="New Job Icon"
                  style={{ width: '30px', height: '30px' }}
                />
                <Typography variant="caption">New Job</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{
                  color: 'black',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'none',
                }}
                onClick={handleProfile}
              >
                <img
                  src="../../../Images/Profile.png"
                  alt="Profile Icon"
                  style={{ width: '30px', height: '30px' }}
                />
                <Typography variant="caption">Me</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{
                  color: 'black',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textTransform: 'none',
                }}
              >
                <img
                  src="../../../Images/logout.png"
                  alt="Logout Icon"
                  style={{ width: '30px', height: '30px' }}
                />
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
