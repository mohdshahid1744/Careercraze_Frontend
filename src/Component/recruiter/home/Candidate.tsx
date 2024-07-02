import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/Store/Store';

function Candidate() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { jobid } = useParams<{ jobid: string }>();
  const userId = useSelector((store: RootState) => store.recruiter.UserId);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axiosRecruiterInstance.get(`/recruiter/candidates/${jobid}`);
        console.log('Fetched applicants:', response.data.applicants);
        setApplicants(response.data.applicants || []);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setApplicants([]);
      }
    };

    fetchApplicants();
  }, [jobid]);

  const fetchApplicantProfile = async (userId: string) => {
    setLoadingProfile(true);
    try {
      const response = await axiosRecruiterInstance.get(`/getuser/${userId}`);
      console.log("Response:", response.data.response);
      setSelectedApplicant(response.data.response);
    } catch (error) {
      console.error('Error fetching applicant profile:', error);
    } finally {
      setLoadingProfile(false);
      console.log(selectedApplicant,'---------');
      
      setOpenDialog(true);
    }
  };

  const handleViewProfile = (userId: string) => {
    fetchApplicantProfile(userId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePdfDownload = (cvUrl: string) => {
    const anchor = document.createElement('a');
    anchor.href = cvUrl;
    console.log("SAD",cvUrl);
    
    anchor.download = 'resume.pdf';
    anchor.click();
};

  if (applicants.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        No Apllications
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'beige', padding: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Applicants for Job
      </Typography>
      {applicants.map((applicant, index) => (
        <Box key={index} sx={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px' }}>
          {applicant.avatar && (
            <Box sx={{ marginBottom: '10px' }}>
              <img src={applicant.avatar} alt={`${applicant.name}'s avatar`} style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
            </Box>
          )}
          <Typography variant="h6">{applicant.name}</Typography>
          <Typography variant="body1">Email: {applicant.email}</Typography>
          <Typography variant="body1">Mobile: {applicant.mobile}</Typography>
          <span
            onClick={() => handlePdfDownload(applicant.cv)}
            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
          >
            Download CV
          </span>
          <Button onClick={() => handleViewProfile(applicant.userId)}>View Profile</Button>
        </Box>
      ))}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {loadingProfile ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        ) : selectedApplicant ? (
          <>
            <DialogTitle>{selectedApplicant.name}'s Profile</DialogTitle>
            <DialogContent>
              {selectedApplicant.avatar && (
                <Box sx={{ marginBottom: '10px' }}>
                  <img src={selectedApplicant.avatar} alt={`${selectedApplicant.name}'s avatar`} style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
                </Box>
              )}
              <Typography>Email: {selectedApplicant.email}</Typography>
              <Typography>Mobile: {selectedApplicant.mobile}</Typography>
              <Typography>Title: {selectedApplicant.title}</Typography>
              <Typography>
                Skills: {selectedApplicant.skills.map((skill: any, index: number) => (
                  <span key={index}>
                    {skill.skill}
                    {index < selectedApplicant.skills.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </Typography>
              <Typography variant="h6">Education:</Typography>
              {selectedApplicant.education && selectedApplicant.education.length > 0 ? (
                selectedApplicant.education.map((edu: any, index: number) => (
                  <Box key={index} sx={{ marginBottom: '10px' }}>
                    <Typography>School: {edu.school}</Typography>
                    <Typography>Degree: {edu.degree}</Typography>
                    <Typography>Field: {edu.field}</Typography>
                    <Typography>Started: {new Date(edu.started).toLocaleDateString()}</Typography>
                    <Typography>Ended: {new Date(edu.ended).toLocaleDateString()}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No education details available</Typography>
              )}
              <Typography variant="h6">Experience:</Typography>
              {selectedApplicant.experience && selectedApplicant.experience.length > 0 ? (
                selectedApplicant.experience.map((exp: any, index: number) => (
                  <Box key={index} sx={{ marginBottom: '10px' }}>
                    <Typography>Company: {exp.company}</Typography>
                    <Typography>Role: {exp.role}</Typography>
                    <Typography>Started: {new Date(exp.started).toLocaleDateString()}</Typography>
                    <Typography>Ended: {new Date(exp.ended).toLocaleDateString()}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>Fresher</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        ) : (
          <DialogContent>
            <Typography>Error loading profile. Please try again.</Typography>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}

export default Candidate;
