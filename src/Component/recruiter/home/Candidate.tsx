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

  const handlePdfDownload = async (cvUrl: string) => {
    try {
        if (cvUrl) {
            const response = await fetch(`http://localhost:3001/recruiter/getPdf?url=${encodeURIComponent(cvUrl)}`);

            if (!response.ok) {
                console.error("Error while fetch cv using url");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'resume.pdf');
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } else {
            console.error("ERROR: Invalid CV URL");
        }
    } catch (error) {
        console.error("ERROR: Failed to download PDF", error);
    }
};

  if (applicants.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#777' }}>
        No Applications
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '40px' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
        Applicants for Job
      </Typography>
      {applicants.map((applicant, index) => (
        <Box
          key={index}
          sx={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '15px',
            marginBottom: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          {applicant.avatar && (
            <Box sx={{ marginBottom: '10px', textAlign: 'center' }}>
              <img src={applicant.avatar} alt={`${applicant.name}'s avatar`} style={{ borderRadius: '50%', width: '50px', height: '50px', objectFit: 'cover' }} />
            </Box>
          )}
          <Typography variant="h6" sx={{ color: '#333', fontWeight: '600', marginBottom: '10px' }}>
            {applicant.name}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', marginBottom: '5px' }}>
            Email: {applicant.email}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', marginBottom: '15px' }}>
            Mobile: {applicant.mobile}
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={() => handlePdfDownload(applicant.cv)}
              sx={{
                textTransform: 'none',
                backgroundColor: '#007BFF',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
                fontWeight: 'bold',
                display: 'inline-block',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#0056b3',
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              Download CV
            </Button>

            <Button
              variant="contained"
              onClick={() => handleViewProfile(applicant.userId)}
              sx={{
                textTransform: 'none',
                backgroundColor: '#007BFF',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
              }}
            >
              View Profile
            </Button>
          </Box>
        </Box>
      ))}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {loadingProfile ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        ) : selectedApplicant ? (
          <>
            <DialogTitle sx={{ color: '#333', fontWeight: 'bold' }}>{selectedApplicant.name}'s Profile</DialogTitle>
            <DialogContent>
              {selectedApplicant.avatar && (
                <Box sx={{ marginBottom: '10px', textAlign: 'center' }}>
                  <img src={selectedApplicant.avatar} alt={`${selectedApplicant.name}'s avatar`} style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover' }} />
                </Box>
              )}
              <Typography sx={{ color: '#333', marginBottom: '10px' }}>Email: {selectedApplicant.email}</Typography>
              <Typography sx={{ color: '#333', marginBottom: '10px' }}>Mobile: {selectedApplicant.mobile}</Typography>
              <Typography sx={{ color: '#333', marginBottom: '10px' }}>Title: {selectedApplicant.title}</Typography>
              <Typography sx={{ color: '#333', marginBottom: '10px' }}>
                Skills: {selectedApplicant.skills.map((skill: any, index: number) => (
                  <span key={index}>
                    {skill.skill}
                    {index < selectedApplicant.skills.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </Typography>
              <Typography variant="h6" sx={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>Education:</Typography>
              {selectedApplicant.education && selectedApplicant.education.length > 0 ? (
                selectedApplicant.education.map((edu: any, index: number) => (
                  <Box key={index} sx={{ marginBottom: '10px', paddingLeft: '10px', borderLeft: '3px solid #007BFF' }}>
                    <Typography sx={{ color: '#333', marginBottom: '5px' }}>School: {edu.school}</Typography>
                    <Typography sx={{ color: '#333', marginBottom: '5px' }}>Degree: {edu.degree}</Typography>
                    <Typography sx={{ color: '#333', marginBottom: '5px' }}>Field: {edu.field}</Typography>
                    <Typography sx={{ color: '#333', marginBottom: '5px' }}>Started: {new Date(edu.started).toLocaleDateString()}</Typography>
                    <Typography sx={{ color: '#333', marginBottom: '5px' }}>Ended: {new Date(edu.ended).toLocaleDateString()}</Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: '#666' }}>No education details available</Typography>
              )}
              <Typography variant="h6" sx={{ marginTop: '20px', fontWeight: 'bold', color: '#333' }}>Experience:</Typography>
              {selectedApplicant.experience && selectedApplicant.experience.length > 0 ? (
                selectedApplicant.experience.map((exp: any, index: number) => (
                  <Box key={index} sx={{ marginBottom: '10px', paddingLeft: '10px', borderLeft: '3px solid #007BFF' }}>
                    <Typography sx={{ color: '#333', marginBottom: '5px' }}>Company: {exp.company}</Typography>
                    <Typography sx={{ color: '#333', marginBottom: '5px' }}>Role: {exp.role}</Typography>
                    <Typography sx={{ color: '#333', marginBottom: '5px' }}>Started: {new Date(exp.started).toLocaleDateString()}</Typography>
                    <Typography sx={{ color: '#333', marginBottom: '5px' }}>Ended: {new Date(exp.ended).toLocaleDateString()}</Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: '#666' }}>Fresher</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} sx={{ color: '#007BFF' }}>Close</Button>
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

