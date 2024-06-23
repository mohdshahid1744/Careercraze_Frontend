import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Grid, TextField } from '@mui/material';
import { userLogout } from '../../../Redux/Slice/userSlice';
import { RootState } from '../../../Redux/Store/Store';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.UserId);
  console.log("AS",user);
  

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    dispatch(userLogout());
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const handleJob = () => {
    navigate('/job');
  };

  const handleProfile = () => {
    if (user) {
      navigate(`/profile/${user}`);
    }
  };
  const handleSavedjob=()=>{
    navigate("/saved-jobs")
  }

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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id="search"
              label="Search"
              sx={{
                width: '500px',
                backgroundColor: 'skyblue',
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
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}>
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
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleSavedjob}>
                  <img src="../../../Images/savejob.png" alt="Job Icon" style={{ width: '30px', height: '30px' }} />
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
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
        </Typography>
        <Grid container justifyContent="flex-end" className="sm:w-full sm:ml-auto md:w-4/5 lg:w-3/5 xl:w-1/2" sx={{ width: '300px', height: '400px', backgroundColor: 'white', borderRadius: '10px', marginLeft: '-100px' }}>
          <Box p={1}>
            <Typography variant="body1" sx={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px', boxShadow: '-5px 0 5px rgba(0, 0, 0, 0.1)', marginTop: "150px" }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Name: Hakkem
                </Typography>
                <Typography variant="body1">
                  Email: Hakkeem@gmail.com
                </Typography>
              </div>
            </Typography>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
