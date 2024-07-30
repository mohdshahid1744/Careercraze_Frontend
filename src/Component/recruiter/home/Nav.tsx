import React from 'react';
import { Box, Typography, Grid, AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Nav() {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate('/recruiter/recHome');
  };

  return (
    <AppBar
      position="static"
      sx={{
        height: '85px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', // Add shadow here
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <img
            src="../../../Images/logo.png"
            alt="Logo"
            className="w-16 h-auto absolute"
            style={{ top: '10px', left: '50px' }}
          />
        </Typography>

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
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
