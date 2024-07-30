import React, { useEffect, useState } from 'react';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { axiosUserInstance } from '../../../utils/axios/Axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, CircularProgress, Button, Grid, Paper, Chip } from '@mui/material';
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        Job Details
      </Typography>
      <Paper elevation={3} sx={{ padding: '20px', borderRadius: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" component="div" gutterBottom>
              {jobDetails.jobrole}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {jobDetails.companyname}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Experience:</strong> {jobDetails.minexperience} - {jobDetails.maxexperience} years
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Salary:</strong> ₹{jobDetails.minsalary} - ₹{jobDetails.maxsalary}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Location:</strong> {jobDetails.joblocation}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Employment Type:</strong> {jobDetails.emptype}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Skills:</strong>
            </Typography>
            {jobDetails.skills.map((skill: string, index: number) => (
              <Chip key={index} label={skill} sx={{ margin: '5px' }} />
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Description:</strong>
            </Typography>
            <Typography>{jobDetails.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            {hasApplied ? (
              <Button variant="contained" color="primary" style={{ marginTop: '30px' }} disabled>
                Applied
              </Button>
            ) : (
              <Button variant="contained" color="primary" style={{ marginTop: '30px' }} onClick={handleApply}>
                Apply
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
      <ApplyModal
        open={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplySubmit}
      />
    </Box>
  );
}

export default SingleJob;
