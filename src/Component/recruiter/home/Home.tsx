import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Container, CardContent, Card } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { recruiterLogout } from '../../../Redux/Slice/recruiterSlice';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { RootState } from '../../../Redux/Store/Store';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [jobpost, setJobPost] = useState<any[]>([]);
  const userId = useSelector((store: RootState) => store.recruiter.UserId);
  const [currentPage, setCurrentPage] = useState(1); 
  const [postsPerPage] = useState(2);

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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosRecruiterInstance.get(`/recruiter/getjob/${userId}`);
        console.log('Fetched jobs:', response.data); 
        const jobsArray = response.data.jobs?.jobs || [];
        setJobPost(jobsArray);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobPost([]);
      }
    };

    if (userId) {
      fetchJobs();
    }
  }, [userId]);

  const handleDelete = async (postId: string) => {
    try {
      let response = await axiosRecruiterInstance.delete('/recruiter/deletejob', { data: { postId } });
      if (response.status === 200) {
        const updatedJobPost = jobpost.filter(job => job._id !== postId);
        setJobPost(updatedJobPost);
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
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = jobpost.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
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
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}>
                  <img src="../../../Images/Home.png" alt="Home Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Home</Typography>
                </Button>
              </Grid>
              <Grid item></Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleNewJob}>
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
        <Typography variant="h4" component="h1" gutterBottom style={{ marginLeft: "250px" }} >
          Job List
        </Typography>
        <Grid container justifyContent="flex-end" sx={{ width: '300px', height: '400px', backgroundColor: 'white', borderRadius: '10px', marginLeft: '-100px' }}>
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
        <Box className="flex flex-wrap justify-center" style={{ marginLeft: '200px', marginTop: '-380px' }} >
          {currentPosts.map((job) => (
            <Card key={job._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 m-4 shadow-md" style={{ borderRadius: "20px" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {job.jobrole}
                </Typography>
                <Typography color="textSecondary">
                  {job.companyname}
                </Typography>
                <Typography>
                  Experience: {job.minexperience} - {job.maxexperience} years
                </Typography>
                <Typography>
                  Salary: ₹{job.minsalary} - ₹{job.maxsalary}
                </Typography>
                <Typography>
                  Location: {job.joblocation}
                </Typography>
                <Typography>
                  Employment Type: {job.emptype}
                </Typography>
                <Typography>
                  Skills: {job.skills.join(', ')}
                </Typography>

                <div className="flex justify-between mt-4">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(job._id)}
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #004080 30%, #333333 90%)',
                      color: 'white',
                      borderRadius: '20px',
                      padding: '8px 16px',
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(job._id)}
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #B30000 30%, #333333 90%)',
                      color: 'white',
                      borderRadius: '20px',
                      padding: '8px 16px',
                    }}
                  >
                    Delete
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleCandidates(job._id)}
                    style={{
                      borderRadius: '20px',
                      padding: '8px 16px',
                      marginTop: '10px',
                      textDecoration: 'none',
                    }}
                  >
                    Candidates
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
            style={{ margin: '0 5px' }}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            disabled={currentPosts.length < postsPerPage || jobpost.length === 0}
            onClick={() => paginate(currentPage + 1)}
            style={{ margin: '0 5px' }}
          >
            Next
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
