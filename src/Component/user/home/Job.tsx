import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosRecruiterInstance, axiosUserInstance } from '../../../utils/axios/Axios';
import { Box, Typography, Button, Grid, AppBar, Toolbar, TextField, InputAdornment, Select, MenuItem, SelectChangeEvent, Pagination, Snackbar, Alert, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { userLogout } from '../../../Redux/Slice/userSlice';
import { RootState } from '../../../Redux/Store/Store';
import { setJobs } from '../../../Redux/Slice/jobSlice';

const Job = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [employmentType, setEmploymentType] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [savedJobSnackbarOpen, setSavedJobSnackbarOpen] = useState<boolean>(false);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [currentJobId, setCurrentJobId] = useState<string>('');
  const jobsPerPage = 3;
  const [isJobSaved, setIsJobSaved] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  
  const user = useSelector((state: RootState) => state.user.UserId);
  const jobPosts = useSelector((state: RootState) => state.job.jobs);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosRecruiterInstance.get('/recruiter/getjoball');
        const jobsArray = response.data.jobs?.jobs || [];
        dispatch(setJobs(jobsArray));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [dispatch]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axiosUserInstance.get(`/getsavejob`);
        const savedJobsArray = response.data.savedJobs || [];
        setSavedJobs(new Set(savedJobsArray.map((job: any) => job.jobId)));
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(userLogout());
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const handleSavedjob = () => {
    navigate("/saved-jobs");
  };

  const handleProfile = () => {
    if (user) {
      navigate(`/profile/${user}`);
    }
  };

  const handleHome = () => {
    navigate('/home');
  };

  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const jobId = event.currentTarget.getAttribute('data-id');
    if (jobId) {
      console.log(`Job ID:${jobId}`);
      navigate(`/job/${jobId}`);
    }
  };

  const handleEmploymentTypeChange = (event: SelectChangeEvent<string>) => {
    setEmploymentType(event.target.value as string);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchLocation(value);
    handleSearchSubmit(value);
  };
  useEffect(() => {
    console.log("Updated savedJobs:", savedJobs);
  }, [savedJobs]);
  
  const handleSaveJob = async (job: any) => {
    try {
      const response = await axiosUserInstance.post('/savejob', {
        jobId: job._id,
        userId: user
      });
  
      const { message, job: savedJob } = response.data.response;
      console.log("dataaaaaa",response.data.response);
      
  
      setSavedJobs(prevSavedJobs => {
        const newSavedJobs = new Set(prevSavedJobs);
        const jobId = savedJob ? savedJob._id : null;
        
        if (jobId) {
          const jobAlreadySaved = newSavedJobs.has(jobId);
          if (!jobAlreadySaved) {
            newSavedJobs.add(jobId);
            setIsJobSaved(true);
          } else {
            setIsJobSaved(false);
          }
          setCurrentJobId(jobId);
        }
  
        return newSavedJobs;
      });
  
      setSavedJobSnackbarOpen(true);
      setSnackbarMessage(message);
      console.log("snackbarrr",message);
      
  
    } catch (error) {
      console.error('Error saving job:', error);
      setSnackbarMessage("Error saving job. Please try again.");
      setSavedJobSnackbarOpen(true);
    }
  };
  
  
  
  
  

  const handleCloseSnackbar = () => {
    setSavedJobSnackbarOpen(false);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSearchSubmit = async (searchTerm: string) => {
    try {
      let response;
      if (searchTerm.trim() === '') {
        response = await axiosRecruiterInstance.get('/recruiter/getjoball');
      } else {
        response = await axiosRecruiterInstance.post('/recruiter/searchjob', { searchTerm });
      }
      const jobsArray = response.data.matchedJobs || response.data.jobs?.jobs || [];
      dispatch(setJobs(jobsArray));
    } catch (error) {
      console.error('Error searching jobs:', error);
    }
  };

  const filteredJobPosts = Array.isArray(jobPosts) ? jobPosts.filter((job) => {
    const matchesEmploymentType = employmentType ? job.emptype === employmentType : true;
    const matchesLocation = searchLocation ? job.joblocation.toLowerCase().includes(searchLocation.toLowerCase()) : true;
    return matchesEmploymentType && matchesLocation;
  }) : [];

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobPosts.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobPosts.length / jobsPerPage);

  const getBookmarkIcon = (jobId: string) => {
    return savedJobs.has(jobId) ? (
      <BookmarkIcon sx={{ color: 'blue' }} />
    ) : (
      <BookmarkBorderIcon />
    );
    
    
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id="search"
              label="Search by location"
              value={searchLocation}
              onChange={handleSearchChange}
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
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleSavedjob}>
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
                  <img src="../../../Images/profile.png" alt="Profile Icon" style={{ width: '30px', height: '30px' }} />
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
        Job List
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Select
          value={employmentType}
          onChange={handleEmploymentTypeChange}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">
            <em>All Employment Types</em>
          </MenuItem>
          <MenuItem value="Full-Time">Full-Time</MenuItem>
          <MenuItem value="Part-Time">Part-Time</MenuItem>
          <MenuItem value="Remote">Remote</MenuItem>
          <MenuItem value="Internship">Internship</MenuItem>
        </Select>
      </Box>
      <Box className="flex flex-wrap justify-center">
        {currentJobs.length === 0 && (
          <Typography variant="body1" gutterBottom>
            No jobs available.
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <Button data-id={job._id} onClick={handleButton}>Show details</Button>
              <IconButton onClick={() => handleSaveJob(job)}>
                {getBookmarkIcon(job._id)}
              </IconButton>
            </Box>
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
      <Snackbar
  open={savedJobSnackbarOpen}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
>
  <Alert onClose={handleCloseSnackbar} severity={isJobSaved ? "success" : "info"}>
    {snackbarMessage}
  </Alert>
</Snackbar>

    </Box>
  );
};

export default Job;

