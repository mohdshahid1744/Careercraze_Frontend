import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Button, Tooltip,Card,CardContent } from '@mui/material';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../Redux/Store/Store';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Candidate() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmRejectDialog, setConfirmRejectDialog] = useState(false);
  const [confirmShortlistDialog, setConfirmShortlistDialog] = useState(false);
  const [actionApplicantId, setActionApplicantId] = useState<string | null>(null);
  const { jobid } = useParams<{ jobid: string }>();
  const userId = useSelector((store: RootState) => store.recruiter.UserId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axiosRecruiterInstance.get(`/recruiter/candidates/${jobid}`);
        const applicantsData = response.data.applicants || [];
        const updatedApplicants = await Promise.all(applicantsData.map(async (applicant: any) => {
          try {
            const profileResponse = await axiosRecruiterInstance.get(`/getuser/${applicant.userId}`);
            const profile = profileResponse.data.response;

            return {
              ...applicant,
              avatar: profile.avatar, 
            };
          } catch (error) {
            console.error(`Error fetching profile for applicant ${applicant.userId}:`, error);
            return applicant; 
          }
        }));

        setApplicants(updatedApplicants);
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
      setOpenDialog(true);
    }
  };

  const handleViewProfile = (userId: string) => {
    fetchApplicantProfile(userId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleHome = () => {
    navigate('/recruiter/recHome');
  };
  const handlePdfDownload = async (cvUrl: string) => {
    try {
      if (cvUrl) {
        const response = await fetch(`http://localhost:3001/recruiter/getPdf?url=${encodeURIComponent(cvUrl)}`);
        if (!response.ok) {
          console.error("Error while fetching CV using URL");
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

  const updateApplicantStatus = async (applicantId: string, status: string) => {
    try {
      await axiosRecruiterInstance.post('/recruiter/updateapplystatus', { jobId: jobid, userId: applicantId, status });
      setApplicants(applicants.map(applicant => 
        applicant.userId === applicantId ? { ...applicant, status } : applicant
      ));
      console.log(`Applicant ${applicantId} status updated to ${status}`);
    } catch (error) {
      console.error(`Error updating applicant status to ${status}:`, error);
    }
  };

  const handleReject = (applicantId: string) => {
    setActionApplicantId(applicantId);
    setConfirmRejectDialog(true);
  };

  const handleShortlist = (applicantId: string) => {
    setActionApplicantId(applicantId);
    setConfirmShortlistDialog(true);
  };

  const handleConfirmReject = async () => {
    if (actionApplicantId) {
      await updateApplicantStatus(actionApplicantId, 'rejected');
      setConfirmRejectDialog(false);
      setActionApplicantId(null);
    }
  };

  const handleConfirmShortlist = async () => {
    if (actionApplicantId) {
      await updateApplicantStatus(actionApplicantId, 'shortlisted');
      setConfirmShortlistDialog(false);
      setActionApplicantId(null);
    }
  };

  if (applicants.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#777' }}>
        No Applications
      </Box>
    );
  }
  const totalApplicants = applicants.length;
  const achievedCandidates = applicants.filter(applicant => applicant.status === 'shortlisted').length;
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'beige', padding: '40px' }}>
       <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <IconButton onClick={handleHome} sx={{ marginRight: '16px' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
          Candidates
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
  <Card 
    sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      width: '100%', 
      maxWidth: '100%', 
      height: '60px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      borderRadius: '8px',
      overflow: 'hidden' 
    }}
  >
    <CardContent 
      sx={{ 
        flex: 1, 
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center' 
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ color: '#333', fontWeight: 'bold', fontSize: '14px' }} 
      >
        Total Candidates
      </Typography>
      <Typography 
        variant="h4" 
        sx={{ color: '#007BFF', fontWeight: 'bold', fontSize: '18px' }} 
      >
        {totalApplicants}
      </Typography>
    </CardContent>
    <CardContent 
      sx={{ 
        flex: 1, 
        borderLeft: '1px solid #ddd', 
        padding: '8px', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center' 
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ color: '#333', fontWeight: 'bold', fontSize: '14px',marginTop:'15px' }} 
      >
        Achieved Candidates
      </Typography>
      <Typography 
        variant="h4" 
        sx={{ color: '#28a745', fontWeight: 'bold', fontSize: '18px' }} 
      >
        {achievedCandidates}
      </Typography>
    </CardContent>
  </Card>
</Box>
      <Grid container spacing={3}>
        {applicants.map((applicant, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                textAlign: 'center',
                height: '100%',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
             {applicant.avatar && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
              <img
                src={applicant.avatar}
                alt={`${applicant.name}'s avatar`}
                style={{
                  borderRadius: '50%',
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                }}
              />
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
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <Tooltip title="Download CV" arrow>
                  <IconButton
                    onClick={() => handlePdfDownload(applicant.cv)}
                    sx={{
                      backgroundColor: '#007BFF',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#0056b3',
                      },
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Profile" arrow>
                  <IconButton
                    onClick={() => handleViewProfile(applicant.userId)}
                    sx={{
                      backgroundColor: '#007BFF',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#0056b3',
                      },
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {applicant.status === 'shortlisted' ? (
                  <Typography variant="body1" sx={{ color: '#28a745', fontWeight: 'bold' }}>
                    Shortlisted
                  </Typography>
                ) : applicant.status === 'rejected' ? (
                  <Typography variant="body1" sx={{ color: '#dc3545', fontWeight: 'bold' }}>
                    Rejected
                  </Typography>
                ) : (
                  <>
                    <Tooltip title="Shortlist" arrow>
                      <IconButton
                        onClick={() => handleShortlist(applicant.userId)}
                        sx={{
                          backgroundColor: '#28a745',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: '#218838',
                          },
                        }}
                      >
                        <ThumbUpIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject" arrow>
                      <IconButton
                        onClick={() => handleReject(applicant.userId)}
                        sx={{
                          backgroundColor: '#dc3545',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: '#c82333',
                          },
                        }}
                      >
                        <ThumbDownIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

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

      <Dialog
        open={confirmRejectDialog}
        onClose={() => setConfirmRejectDialog(false)}
      >
        <DialogTitle>Confirm Rejection</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reject this applicant?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRejectDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmReject} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmShortlistDialog}
        onClose={() => setConfirmShortlistDialog(false)}
      >
        <DialogTitle>Confirm Shortlisting</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to shortlist this applicant?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmShortlistDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmShortlist} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Candidate;
