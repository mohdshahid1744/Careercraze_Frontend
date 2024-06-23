import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosRecruiterInstance, axiosUserInstance } from '../../../utils/axios/Axios';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, AppBar, Toolbar, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/solid';
import { userLogout } from '../../../Redux/Slice/userSlice';
import EducationModal from './EducationModal';
import ExperienceModal from './ExperienceModal';
import SkillModal from './SkillModal';
import ProfileData from './ProfileData';
import SkillEditModal from './SkillEditModal';
import EducationEditModal from './EducationEditModal';
import ExperienceEditModal from './ExperienceEditModal';
import { RootState } from '../../../Redux/Store/Store';

function Profile() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isProfileDataOpen, setIsProfileDataOpen] = useState(false);
  const [isSkillDataOpen, setIsSkillDataOpen] = useState(false);
  const [isEducationDataOpen, setIsEducationDataOpen] = useState(false);
  const [isExperienceDataOpen, setIsExperienceDataOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<{ _id: string; skill: string } | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<{ _id: string; school: string, degree: string, field: string, started: Date, ended: Date } | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<{ _id: string;  company: string, role: string, started: Date, ended: Date } | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const fetchUserProfile = async () => {
    try {
      const response = await axiosUserInstance.get(`/getuser/${id}`);
      setUserDetails(response.data.response);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const handleUpdateProfile = () => {
    setIsProfileDataOpen(true);
  };
  const handleSavedjob=()=>{
    navigate("/saved-jobs")
  }
  const handleAddEducation = () => {
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (education: { _id: string; school: string, degree: string, field: string, started: Date, ended: Date }) => {
    setSelectedEducation(education);
    setIsEducationDataOpen(true);
  };

  const handleAddExperience = () => {
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (experience: {_id: string; company: string, role: string, started: Date, ended: Date }) => {
    setIsExperienceDataOpen(true)
    setSelectedExperience(experience)
  };

  const handleAddSkill = () => {
    setIsSkillModalOpen(true);
  };

  const handleEditSkill = (skills: { _id: string; skill: string }) => {
    setIsSkillDataOpen(true);
    setSelectedSkill(skills);
    console.log("Selected Skill:", skills);
  };

  const handleEducationSubmit = async (education: { school: string; degree: string; field: string; started: Date; ended: Date }) => {
    try {
      const response = await axiosUserInstance.put(`/updateEducation/${id}`, education);
      setUserDetails((prevDetails: any) => {
        if (!prevDetails) return null;
        return {
          ...prevDetails,
          education: [...prevDetails.education, response.data],
        };
      });
    } catch (error) {
      console.error('Error adding education:', error);
    } finally {
      setIsEducationModalOpen(false);
    }
  };

  const handleExperienceSubmit = async (experience: { company: string; role: string; started: Date; ended: Date }) => {
    try {
      const response = await axiosUserInstance.put(`/updateExperience/${id}`, experience);
      setUserDetails((prevDetails: any) => {
        if (!prevDetails) return null;
        return {
          ...prevDetails,
          experience: [...prevDetails.experience, response.data],
        };
      });
    } catch (error) {
      console.error('Error adding experience:', error);
    } finally {
      setIsExperienceModalOpen(false);
    }
  };

  const handleSkillSubmit = async (skills: { skill: string }) => {
    try {
      const response = await axiosUserInstance.put(`/updateSkill/${id}`, skills);
      setUserDetails((prevDetails: any) => {
        if (!prevDetails) return null;
        return {
          ...prevDetails,
          skills: [...prevDetails.skills, response.data],
        };
      });
    } catch (error) {
      console.error('Error adding skills:', error);
    } finally {
      setIsSkillModalOpen(false);
    }
  };

  const handleJob = () => {
    navigate('/job');
  };

  const handleLogout = () => {
    dispatch(userLogout());
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const handleHome = () => {
    navigate('/home');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setIsModalOpen(true);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const response = await axiosUserInstance.put(`/updateProfile/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUserDetails((prevDetails: any) => ({
        ...prevDetails,
        avatar: response.data.avatarUrl,
      }));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
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
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleHome}>
                  <img src="../../../Images/Home.png" alt="Home Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Home</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleJob}>
                  <img src="../../../Images/Job.png" alt="Job Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Job</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleSavedjob}>
                  <img src="../../../Images/savejob.png" alt="Job Icon" style={{ width: '30px', height: '30px' }} />
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
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleLogout}>
                  <img src="../../../Images/logout.png" alt="Logout Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Logout</Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
      <div className="w-full max-w-5xl p-6" style={{ marginLeft: "230px" }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: 'background.paper',
            mb: 4
          }}
        >
          <img src="../../../Images/banner.png" alt="Banner" className="w-full mb-4 rounded-lg" style={{ height: "250px" }} />

          {userDetails && (
            <div className="relative flex items-start">
              <div className="absolute -top-[25%] transform -translate-y-1/2 left-5 flex flex-col items-center mb-6">
                <div className="relative">
                  <img src={userDetails?.avatar} alt="Avatar" className="w-20 h-20 rounded-full mb-2 border-2 border-white" />
                  <PlusCircleIcon
                    className="w-5 h-5 absolute bottom-0 right-0 text-green-500 bg-white rounded-full border-2 border-white cursor-pointer"
                    onClick={() => document.getElementById('avatarInput')?.click()}
                  />
                  <input
                    type="file"
                    id="avatarInput"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="ml-5 mt-4">
                <div className="flex items-center">
                  <Typography variant="h5">{userDetails?.name}</Typography>
                  <PencilIcon
                    className="w-6 h-6 ml-2 text-gray-500 cursor-pointer"
                    onClick={handleUpdateProfile}
                  />
                </div>
                <Typography variant="subtitle1">{userDetails?.title}</Typography>
                <Typography variant="subtitle1">{userDetails?.email}</Typography>
                <Typography variant="subtitle1">{userDetails?.mobile}</Typography>
              </div>
            </div>
          )}
          {isModalOpen && (
            <div>
              <button onClick={handleFileUpload}>Upload Avatar</button>
            </div>
          )}
        </Box>

        {userDetails && (
          <>
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: 'background.paper',
                mb: 4,
                position: 'relative'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" align="center" gutterBottom>Education</Typography>
              </div>
              {userDetails.education && userDetails.education.length > 0 ? (
                userDetails.education.map((edu: any, index: number) => (
                  <div key={index} className="mb-4 flex items-center justify-between">
                    <div>
                      <Typography variant="subtitle1">{edu.school}</Typography>
                      <Typography variant="subtitle2">{edu.degree} in {edu.field}</Typography>
                      <Typography variant="subtitle2">{new Date(edu.started).toLocaleDateString()} - {new Date(edu.ended).toLocaleDateString()}</Typography>
                    </div>
                    <PencilIcon
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                      onClick={() => handleEditEducation(edu)}
                    />
                  </div>
                ))
              ) : (
                <Typography variant="subtitle1" className="text-center">
                  No education details provided.
                </Typography>
              )}
              <PlusCircleIcon
                className="w-6 h-6 text-blue-500 cursor-pointer absolute right-4 bottom-4"
                onClick={handleAddEducation}
              />
            </Box>
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: 'background.paper',
                mb: 4,
                position: 'relative'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" align="center" gutterBottom>Experience</Typography>
                
              </div>
              {userDetails.experience && userDetails.experience.length > 0 ? (
  userDetails.experience.map((exp: any, index: number) => (
    <div key={index} className="mb-4 flex items-center justify-between">
      <div>
        <Typography variant="subtitle1">{exp.role} at {exp.company}</Typography>
        <Typography variant="subtitle2">{new Date(exp.started).toLocaleDateString()} - {new Date(exp.ended).toLocaleDateString()}</Typography>
      </div>
      <PencilIcon className="w-6 h-6 text-gray-500 cursor-pointer ml-2" onClick={() => handleEditExperience(exp)} />
    </div>
  ))
) : (
  <Typography variant="subtitle1" className="text-center">
    No experience details provided.
  </Typography>
)}


              <PlusCircleIcon
                className="w-6 h-6 text-blue-500 cursor-pointer absolute right-4 bottom-4"
                onClick={handleAddExperience}
              />
            </Box>
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: 'background.paper',
                mb: 4,
                position: 'relative'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" align="center" gutterBottom>Skills</Typography>
              </div>
              {userDetails.skills && userDetails.skills.length > 0 ? (
                userDetails.skills.map((skillObj: any, index: number) => (
                  <div key={index} className="mb-4 flex items-center justify-between">
                    <Typography variant="subtitle1">{skillObj.skill}</Typography>
                    <PencilIcon
                      className="w-5 h-5 text-gray-500 cursor-pointer"
                      onClick={() => handleEditSkill(skillObj)}
                    />
                  </div>
                ))
              ) : (
                <Typography variant="subtitle1" className="text-center">
                  No skills provided.
                </Typography>
              )}
              <PlusCircleIcon
                className="w-6 h-6 text-blue-500 cursor-pointer absolute right-4 bottom-4"
                onClick={handleAddSkill}
              />
            </Box>
          </>
        )}
      </div>
      <EducationModal
        open={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        onSubmit={handleEducationSubmit}
      />
      <ExperienceModal
        open={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        onSubmit={handleExperienceSubmit}
      />
      <SkillModal
        open={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSubmit={handleSkillSubmit}
      />
      <ProfileData
        open={isProfileDataOpen}
        onClose={() => setIsProfileDataOpen(false)}
        fetchProfileData={fetchUserProfile}
        userDetails={userDetails}
        userId={id ?? ''} 
      />
      <SkillEditModal
        open={isSkillDataOpen}
        onClose={() => setIsSkillDataOpen(false)}
        fetchProfileData={fetchUserProfile}
        skillDetails={selectedSkill}
        userId={id ?? ''}
      />
        <EducationEditModal
        open={isEducationDataOpen}
        onClose={() => setIsEducationDataOpen(false)}
        fetchProfileData={fetchUserProfile}
        educationDetails={selectedEducation}
        userId={id ?? ''}
      />
        <ExperienceEditModal
        open={isExperienceDataOpen}
        onClose={() => setIsExperienceDataOpen(false)}
        fetchProfileData={fetchUserProfile}
        experienceDetails={selectedExperience}
        userId={id ?? ''}
      />
    </Box>
  );
}

export default Profile;
