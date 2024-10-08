import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Grid,
  TextField, Card, CardContent, IconButton, TextareaAutosize,
  Avatar, Modal, Backdrop,Paper,List,ListItem,ListItemAvatar,ListItemText,Menu,MenuItem,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  FormControl, InputLabel,Select,CircularProgress,useMediaQuery,Drawer
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { recruiterLogout } from '../../../Redux/Slice/recruiterSlice';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { RootState } from '../../../Redux/Store/Store';
import { debounce } from 'lodash';
import { keyframes } from '@emotion/react';
import { Theme } from '@mui/material/styles';
interface RecruiterDetails {
  name: string;
  email: string;
  avatar:string;
  followers:string;
  following:string;
  companyName:string;
  companyEmail:string;
}
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


function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [jobpost, setJobPost] = useState<any[]>([]);
  const userId = useSelector((store: RootState) => store.recruiter.UserId);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [status, setStatus] = useState<'pending' | 'verified' | 'rejected' | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [recruiterDetails, setRecruiterDetails] = useState<RecruiterDetails | null>(null);
  const [recruiterEmail, setRecruiterEmail] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchRecruiterResults, setSearchRecruiterResults] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
const [isAnimating, setIsAnimating] = useState(false);
  
const handleClick = () => {
  setIsAnimating(true);
  handleDrawerToggle();
  setTimeout(() => setIsAnimating(false), 300); 
};
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleLogout = () => {
    dispatch(recruiterLogout());
    localStorage.removeItem('recruiterToken');
    navigate('/recruiter/recLogin');
  };

  const handleEdit = (postId: string) => {
    navigate(`/recruiter/editjob/${postId}`);
  };

  const handleNewJob = () => {
    navigate('/recruiter/newjob');
  };

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
  };

  useEffect(() => {
    const fetchRecruiterStatus = async () => {
      try {
        const response = await axiosRecruiterInstance.get(`/recruiter/showverify/${userId}`);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching recruiter status:', error);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axiosRecruiterInstance.get(`/recruiter/getjob/${userId}`);
        console.log('Fetched jobs:', response.data);
        let jobsArray: Array<{ createdAt: string }> = response.data.jobs?.jobs || [];
        jobsArray = jobsArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setJobPost(jobsArray);
        if (jobsArray.length > 0) {
          setSelectedJob(jobsArray[0]); 
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobPost([]);
      }
    };
    
    

    const fetchRecruiterDetails = async () => {
      try {
        const response = await axiosRecruiterInstance.get(`/recruiter/getrecruiter/${userId}`);
        console.log("ASDASDASDASDASDASD",response.data.response);
        
        setRecruiterDetails(response.data.response);
      } catch (error) {
        console.error('Error fetching recruiter details:', error);
      }
    };

    if (userId) {
      fetchRecruiterStatus();
      fetchJobs();
      fetchRecruiterDetails();
    }
  }, [userId]);

  const handleDelete = async (postId: string) => {
    try {
      let response = await axiosRecruiterInstance.delete('/recruiter/deletejob', { data: { postId } });
      if (response.status === 200) {
        const updatedJobPost = jobpost.filter(job => job._id !== postId);
        setJobPost(updatedJobPost);
        setSelectedJob(updatedJobPost.length > 0 ? updatedJobPost[0] : null);
      }
    } catch (error) {
      console.error('Error deleting job post:', error);
    }
  };

  const handleProfile = () => {
    if (userId) {
      navigate(`/recruiter/profile/${userId}`);
    }
  };

  const handleCandidates = (jobid: string) => {
    navigate(`/recruiter/candidates/${jobid}`);
  };
  const handleSearchRecruiterResultClick = (userId: string) => {
    navigate(`/recruiter/profile/${userId}`);
    setSearchText(''); 
    setSearchResults([]); 
    setSearchRecruiterResults([])
    setSearchOpen(false); 
  };
  const handleSearchResultClick = (userId: string) => {
    navigate(`/recruiter/userprofile/${userId}`);
    setSearchText(''); 
    setSearchResults([]); 
    setSearchRecruiterResults([])
    setSearchOpen(false); 
  };
 
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = jobpost.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const fetchSearchedUsers = async (text: string) => {
    try {
      const response = await axiosRecruiterInstance.get(`/recruiter/searchrecruiter?text=${encodeURIComponent(text)}`);
      setSearchResults(response.data.users.users);
      setSearchRecruiterResults(response.data.users.recruiters);
    } catch (error) {
      console.error('Error fetching searched users:', error);
    }
  };

  const debouncedFetchSearchedUsers = useCallback(
    debounce((text: string) => {
      fetchSearchedUsers(text);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    setSearchOpen(true);
    debouncedFetchSearchedUsers(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const menuItems = (
    <>
      <ListItem button>
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'beige' }}>
    

      {status !== 'pending' && status !== 'rejected' && (
        <>
        <AppBar position="static" sx={{ height: '85px', backgroundColor: 'white' }}>
          <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, position: 'relative' }}>
      <img
        src="../../../Images/logo.png"
        alt="Logo"
        style={{
          position: 'absolute',
          top: isSmallScreen ? '-5px' : '-20px',
          left: isSmallScreen ? '0px' : '10px',
          width: isSmallScreen ? '40px' : '60px', 
          height: 'auto',
        }}
      />
    </Typography>
            <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        margin: isSmallScreen ? '0 10px' : '0 auto',
      }}
    >
      <TextField
        id="search"
        label="Search"
        value={searchText}
        onChange={handleSearchChange}
        sx={{
          width: isSmallScreen ? '100%' : isMediumScreen ? '70%' : '500px',
          backgroundColor: '#e3f2fd',
          marginTop: '10px',
          borderRadius: "15px",
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
      {searchOpen && (
        <Paper
          sx={{
            position: 'absolute',
            top: isSmallScreen ? '55px' : '60px',
            left: 0,
            right: 0,
            maxHeight: '50vh',
            overflowY: 'auto',
            zIndex: 1200,
            width: isSmallScreen ? '100%' : 'auto',
          }}
        >
          <List>
            {searchRecruiterResults.map((recruiter) => (
              <ListItem
                key={recruiter._id}
                component="div"
                onClick={() => handleSearchRecruiterResultClick(recruiter._id)}
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
              >
                <ListItemAvatar>
                  <Avatar src={recruiter.avatar} alt={recruiter.name} />
                </ListItemAvatar>
                <ListItemText primary={recruiter.name} secondary={recruiter.title || 'Recruiter'} />
              </ListItem>
            ))}
            {searchResults.map((user) => (
              <ListItem
                key={user._id}
                component="div"
                onClick={() => handleSearchResultClick(user._id)}
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} alt={user.name} />
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.title || 'User'} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
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
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', marginLeft: 'auto', marginRight: '50px' }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}>
                    <img src='../../../Images/Home.png' alt="Home Icon" style={{ width: '30px', height: '30px' }} />
                    <Typography variant="caption">Home</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleNewJob}>
                    <img src='../../../Images/newjob.png' alt="New Job Icon" style={{ width: '30px', height: '30px' }} />
                    <Typography variant="caption">New Job</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleProfile}>
                    <img src='../../../Images/Profile.png' alt="Profile Icon" style={{ width: '30px', height: '30px' }} />
                    <Typography variant="caption">Me</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleLogout}>
                    <img src='../../../Images/logout.png' alt="Logout Icon" style={{ width: '30px', height: '30px' }} />
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
      )}

<Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
  {status === 'pending' ? (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        width: '80%',
        maxWidth: '600px',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
                <img
            src='../../../Images/waiting.JPG'
            alt="Verification Icon"
            style={{
              width: '100%',
              height: '300px',
              marginBottom: '20px',
              borderRadius: '10px',
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
            }}
          />
          <CircularProgress size={120} thickness={4} sx={{ marginBottom: '20px' }} />
          <Typography variant="h5" sx={{ marginBottom: '20px' }}>
            Your account is under verification.
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            Thank you for submitting your details. Our team is currently verifying your account.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This process usually takes up to 24 hours. We appreciate your patience.
          </Typography>
    </Box>
  ) : status === 'rejected' ?       (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        padding: '30px',
        backgroundColor: '#ffffff',
        maxWidth: '400px',
        zIndex: 1000,
      }}
    >
      <Typography variant="h4" gutterBottom style={{ fontSize: '2rem', color: '#ff5252' }}>
        Account Rejected 😞
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '20px', textAlign: 'center' }}>
        We're sorry, your account verification has been rejected. Please contact support for further assistance.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        sx={{ textTransform: 'none' }}
      >
        Logout
      </Button>
    </Box>
  ) : (
    <Box
  sx={{
    mt: 4,
    maxWidth: '1000px',
    width: '100%',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' }, 
    justifyContent: 'space-between',
    alignItems: 'center', 
  }}
>
<Grid item xs={12} lg={3} className="lg:visible hidden lg:block" >
    <Box
      sx={{
        width: { xs: '90%', lg: '300px' },
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: 'center',
        mt: { xs: '20px', lg: '-270px' },
        ml: { xs: 'auto', lg: '-140px' },
        position: 'relative',
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          mx: 'auto',
          position: 'relative',
          border: '2px solid white',
        }}
        alt={recruiterDetails?.name}
        src={recruiterDetails?.avatar}
      />
      <Typography variant="h6" sx={{ marginBottom: '10px', marginTop: '40px' }}>
        {recruiterDetails?.name}
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: '5px' }}>
        Email: {recruiterDetails?.email}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', marginBottom: '5px' }}>
        Followers: {recruiterDetails?.followers.length || 0}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', marginBottom: '5px' }}>
        Following: {recruiterDetails?.following.length || 0}
      </Typography>
      <Box sx={{ borderBottom: '1px solid gray', margin: '10px 0' }} />
      <Typography variant="body2" sx={{ fontSize: '0.75rem', marginBottom: '5px' }}>
        Company : {recruiterDetails?.companyName}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', marginBottom: '5px' }}>
        Company Email : {recruiterDetails?.companyEmail}
      </Typography>
    </Box>
  </Grid>

  <Box sx={{ width: '100%', mt: { xs: 2, md: 0 } }}>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            backgroundColor: 'beige',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid #000000',
            ml: { xs: 0, md: 4 },
            width: '100%',
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '20px' }}>
            Posted Jobs
          </Typography>
          {currentPosts.length > 0 ? (
            currentPosts.map((job) => (
              <Card
                key={job._id}
                sx={{
                  marginBottom: '20px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                  height: 'auto', 
                  borderRadius: '15px',
                }}
              >
                <CardContent>
                  <Typography variant="h6">{job.jobrole}</Typography>
                  <Typography variant="body2">{job.joblocation}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1 }}
                    onClick={() => handleViewDetails(job)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2">No job posts available.</Typography>
          )}
          <Pagination
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            totalPosts={jobpost.length}
            paginate={paginate}
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        {selectedJob && (
          <Box
            sx={{
              backgroundColor: 'beige',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
              minHeight: '100%',
              width: '100%', 
              ml: { xs: 0, md: 4 },
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: '20px' }}>
              {selectedJob.title}
            </Typography>
            <img
              src={selectedJob.companylogo}
              alt={selectedJob.companyname}
              style={{ height: '200px', width: '80px', objectFit: 'contain', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
              <strong>Job Role:</strong> {selectedJob.jobrole}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
              <strong>Company Name:</strong> {selectedJob.companyname}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
              <strong>Experience:</strong> {selectedJob.minexperience} - {selectedJob.maxexperience} Years
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
              <strong>Salary:</strong> {selectedJob.minsalary} - {selectedJob.maxsalary}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
              <strong>Employee Type:</strong> {selectedJob.emptype}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
              <strong>Skill Sets Required:</strong> {selectedJob.skills.join(', ')}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
              <strong>Description:</strong> {selectedJob.description}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, marginRight: '10px' }}
              onClick={() => handleEdit(selectedJob._id)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 1 }}
              onClick={() => handleDelete(selectedJob._id)}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleCandidates(selectedJob._id)}
              sx={{
                borderRadius: '20px',
                padding: '8px 16px',
                mt: '10px',
                textDecoration: 'none',
              }}
            >
              Candidates
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  </Box>
</Box>

  )}
</Container>
    </Box>
  );
}

const Pagination = ({ currentPage, postsPerPage, totalPosts, paginate }: any) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      {pageNumbers.map((number) => (
        <Button key={number} onClick={() => paginate(number)} variant={number === currentPage ? 'contained' : 'outlined'} sx={{ margin: '0 5px' }}>
          {number}
        </Button>
      ))}
    </Box>
  );
};

export default Home;

