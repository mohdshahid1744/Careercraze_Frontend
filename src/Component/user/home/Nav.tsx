import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Grid, Button, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { userLogout } from '../../../Redux/Slice/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/Store/Store';

function Nav() {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const userId = useSelector((state: RootState) => state.user.UserId);

  const handleHome = () => {
    navigate('/home');
  };

  const handleJob = () => {
    navigate('/job');
  };

  const handleSavedJob = () => {
    navigate('/saved-jobs');
  };

  const handleProfile = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };
  const handleLogout = () => {
    dispatch(userLogout());
    localStorage.removeItem('userToken');
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ height: '85px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <img
            src='../../../Images/logo.png'
            alt="Logo"
            className="w-16 h-auto absolute"
            style={{ top: '10px', left: '50px' }}
          />
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            id="search"
            label="Search"
            sx={{
              width: '500px',
              backgroundColor: '#e3f2fd',
              borderRadius: "15px",
              top: '15px',
              border: "none",
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleHome}>
                <img src="../../../Images/Home.png" alt="Home Icon" style={{ width: '30px', height: '30px' }} />
                <Typography variant="caption">Home</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleJob}>
                <img src="../../../Images/Job.png" alt="Job Icon" style={{ width: '30px', height: '30px' }} />
                <Typography variant="caption">Job</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleSavedJob}>
                <img src="../../../Images/savejob.png" alt="Save Job Icon" style={{ width: '30px', height: '30px' }} />
                <Typography variant="caption">Save Job</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}>
                <img src="../../../Images/message.png" alt="Message Icon" style={{ width: '30px', height: '30px' }} />
                <Typography variant="caption">Message</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleProfile}>
                <img src="../../../Images/Profile.png" alt="Profile Icon" style={{ width: '30px', height: '30px' }} />
                <Typography variant="caption">Me</Typography>
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
  );
}

export default Nav;
