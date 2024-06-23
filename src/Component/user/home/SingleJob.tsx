import React, { useEffect, useState } from 'react';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { axiosUserInstance } from '../../../utils/axios/Axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import ApplyModal from './ApplyModal';
import { RootState } from '../../../Redux/Store/Store';


function SingleJob() {
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.user.UserId);

  const handleApply = () => {
    setIsApplyModalOpen(true);
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axiosRecruiterInstance.get(`/recruiter/getsingle/${id}`);
        setJobDetails(response.data.jobs);
        console.log("Job Details:", response.data);

        if (userId && response.data.jobs.applicants) {
          const hasUserApplied = response.data.jobs.applicants.some((applicant: any) => applicant.userId === userId);
          setHasApplied(hasUserApplied);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
    fetchJobDetails();
  }, [id, userId]);

  if (!jobDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleApplySubmit = async (applicants: { name: string, mobile: string, email: string, cv: File }) => {
    const formData = new FormData();
    if (id) {
      formData.append('jobid', id);
    }
    if (userId) {
      formData.append('userId', userId);
    }
    
    formData.append('name', applicants.name);
    formData.append('mobile', applicants.mobile);
    formData.append('email', applicants.email);
    formData.append('cv', applicants.cv);

    try {
      const response = await axiosUserInstance.post(`/applyjob`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Application Response:", response);
      setHasApplied(true); 
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsApplyModalOpen(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'beige', padding: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Job Details
      </Typography>
      <Box sx={{ padding: '20px', backgroundColor: 'white', borderRadius: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Typography variant="h6" component="div">
            {jobDetails.jobrole}
          </Typography>
        </Box>
        <Typography color="textSecondary">
          {jobDetails.companyname}
        </Typography>
        <Typography>
          Experience: {jobDetails.minexperience} - {jobDetails.maxexperience} years
        </Typography>
        <Typography>
          Salary: ₹{jobDetails.minsalary} - ₹{jobDetails.maxsalary}
        </Typography>
        <Typography>
          Location: {jobDetails.joblocation}
        </Typography>
        <Typography>
          Employment Type: {jobDetails.emptype}
        </Typography>
        <Typography>
          Skills: {jobDetails.skills.join(', ')}
        </Typography>
        <Typography>
          Description: {jobDetails.description}
        </Typography>
        <Box sx={{ margin: 'auto 0' }}>
          {hasApplied ? (
            <Button variant="contained" color="primary" style={{ marginTop: '30px' }} disabled>
              Applied
            </Button>
          ) : (
            <Button variant="contained" color="primary" style={{ marginTop: '30px' }} onClick={handleApply}>
              Apply
            </Button>
          )}
        </Box>
      </Box>
      <ApplyModal
        open={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplySubmit}
      />
    </Box>
  );
}

export default SingleJob;

