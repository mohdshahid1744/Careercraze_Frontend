import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Redux/Store/Store';
import { useNavigate } from 'react-router-dom';
import { removeSavedJob } from '../../../Redux/Slice/jobSlice';
import { Box, Typography, Button, Grid, AppBar, Toolbar, Pagination } from '@mui/material';
import { userLogout } from '../../../Redux/Slice/userSlice';

function SaveJobs() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedJobs = useSelector((state: RootState) => state.job.savedJobs);
  const user = useSelector((state: RootState) => state.user.UserId);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 3; 

  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const jobId = event.currentTarget.getAttribute('data-id');
    if (jobId) {
      console.log(`Job ID: ${jobId}`);
      navigate(`/job/${jobId}`);
    }
  };

  const handleRemove = (jobId: string) => {
    dispatch(removeSavedJob(jobId));
  };

  const handleProfile = () => {
    if (user) {
      navigate(`/profile/${user}`);
    }
  };

  const handleLogout = () => {
    dispatch(userLogout());
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const handleHome = () => {
    navigate('/home');
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = savedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(savedJobs.length / jobsPerPage);

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
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}>
                  <img src="../../../Images/Job.png" alt="Job Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Job</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} >
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
      <Typography variant="h4" component="h1" gutterBottom>
        Saved Jobs
      </Typography>
      <Box className="flex flex-wrap justify-center">
        {currentJobs.length === 0 && (
          <Typography variant="body1" gutterBottom>
            No saved jobs.
          </Typography>
        )}
        {currentJobs.map((job) => (
          <Box key={job._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 m-4 shadow-xl rounded-xl" sx={{ borderRadius: "20px", padding: '20px', backgroundColor: 'white', width: '1000px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div">
                {job.jobrole}
              </Typography>
              <img
                src={job.companylogo}
                alt={job.companyname}
                className="ml-4"
                style={{ height: '50px', width: '50px', objectFit: 'contain' }}
              />
            </Box>
            <Typography color="textSecondary">
              {job.companyname}
            </Typography>
            <Typography>
              Location: {job.joblocation}
            </Typography>
            <Button data-id={job._id} onClick={handleButton}>Show details</Button>
            <Button onClick={() => handleRemove(job._id)}>Remove Job</Button>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default SaveJobs;
