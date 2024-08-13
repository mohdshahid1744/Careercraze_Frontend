import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Card, CardContent, Grid, Divider, IconButton } from '@mui/material';
import { RootState } from '../../../Redux/Store/Store';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface Applicant {
  userId: string;
  name: string;
  email: string;
  mobile: string;
  cv: string;
  status: string;
  createdAt: string;
}

interface AppliedJob {
  _id: string;
  jobrole: string;
  companyname: string;
  joblocation: string;
  createdAt: string;
  applicants: Applicant[];
}

function AppliedJobs() {
  const userId = useSelector((state: RootState) => state.user.UserId);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axiosRecruiterInstance.get(`/recruiter/appliedjobs/${userId}`);
        setAppliedJobs(response.data);
      } catch (err) {
        setError('Error fetching applied jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [userId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const handleJob = () => {
    navigate('/job');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return '#4caf50'; 
      case 'rejected':
        return '#f44336';
      default:
        return '#9e9e9e'; 
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'rejected':
        return 'Not selected by employer';
      case 'shortlisted':
        return 'You are shortlisted'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Box
      sx={{
        padding: '30px',
        backgroundColor: 'beige',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <IconButton onClick={handleJob} sx={{ marginRight: '16px' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flex: 1, textAlign: 'center', color: '#333' }}>
          Applied Jobs
        </Typography>
      </Box>
      {appliedJobs.length === 0 ? (
        <Typography>No applied jobs found.</Typography>
      ) : (
        appliedJobs.map((job) => {
          const applicant = job.applicants.find(applicant => applicant.userId === userId);
          return (
            <Card
              key={job._id}
              sx={{
                marginBottom: '20px',
                width: '100%',
                maxWidth: '1200px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                backgroundColor: '#fff',
                overflow: 'hidden',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {job.jobrole}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#666' }}>
                      {job.companyname}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#777' }}>
                      Location: {job.joblocation}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#777' }}>
                      Applied on: {applicant ? new Date(applicant.createdAt).toLocaleString() : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} container alignItems="center" justifyContent="flex-end">
                    <Typography
                      variant="body2"
                      sx={{
                        color: applicant ? getStatusColor(applicant.status) : '#9e9e9e',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                    >
                      {applicant ? getStatusText(applicant.status) : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardContent>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Job posted on: {new Date(job.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
}

export default AppliedJobs;
