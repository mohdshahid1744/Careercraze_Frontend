import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Pagination } from '@mui/material';
import { userLogout } from '../../../Redux/Slice/userSlice';
import axios from 'axios';
import { axiosUserInstance } from '../../../utils/axios/Axios';

const SaveJobs: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 3;

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axiosUserInstance.get('/getsavejob');
        console.log("resppppppppppppppppppppp",response);
        
        if (Array.isArray(response.data.response)) {
          setSavedJobs(response.data.response);
        } else {
          console.error("Unexpected data format:", response.data);
          setSavedJobs([]);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        setSavedJobs([]);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleButton = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const handleRemove = async (jobId: string) => {
    try {
      await axiosUserInstance.delete(`/deletesavejob/${jobId}`);
      setSavedJobs((prevJobs) => prevJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error("Error removing saved job:", error);
    }
  };

  const handleProfile = () => {
    const user = localStorage.getItem('userId');
    if (user) {
      navigate(`/profile/${user}`);
    }
  };

  const handleLogout = () => {
    dispatch(userLogout());
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const handleJob = () => {
    navigate('/job');
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
            <Button onClick={() => handleButton(job.jobId)}>Show details</Button>
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
};

export default SaveJobs;
