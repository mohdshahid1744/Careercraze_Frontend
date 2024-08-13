import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosRecruiterInstance, axiosUserInstance } from '../../../utils/axios/Axios';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, AppBar, Toolbar, Button,Avatar,Menu, MenuItem, IconButton } from '@mui/material';
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
import PostEditModal from './EditPostModal';
import { RootState } from '../../../Redux/Store/Store';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import MessageIcon from '@mui/icons-material/Message';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { formatDistanceToNow } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modal from './UserListModal';
function Profile() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isProfileDataOpen, setIsProfileDataOpen] = useState(false);
  const [isSkillDataOpen, setIsSkillDataOpen] = useState(false);
  const [isEducationDataOpen, setIsEducationDataOpen] = useState(false);
  const [isExperienceDataOpen, setIsExperienceDataOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<{ _id: string; skill: string } | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<{ _id: string; school: string, degree: string, field: string, started: Date, ended: Date } | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<{ _id: string;  company: string, role: string, started: Date, ended: Date } | null>(null);
  const [visiblePosts, setVisiblePosts] = useState(2); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [modalUserIds, setModalUserIds] = useState<string[]>([]);
  const [modalUserId, setModalUserId] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalTitles, setModalTitles] = useState('');
  const [selectedPost, setSelectedPost] = useState<any>(null);
const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
const [showOptions, setShowOptions] = useState<{ [key: string]: boolean }>({});

const handlePostUpdated = (updatedPost:any) => {
  setPosts((prevPosts) => prevPosts.map((post) => 
    post._id === updatedPost._id ? updatedPost : post
  ));
};
const toggleOptions = (postId: string) => {
  setShowOptions((prevState) => ({
    ...prevState,
    [postId]: !prevState[postId],
  }));
};
  
  const handleMenuClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = async (postId:string) => {
    try {
      const response = await axiosUserInstance.post('/delete', { postId});
      console.log('Delete Post Response:', response.data);
      setPosts(posts.filter(post => post._id !== postId)); 
      fetchUserPosts();
      setAnchorEl(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  const showMorePosts = () => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 2); 
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  console.log("IDDDDD",id);
  
  const loggedInUserId = useSelector((state: RootState) => state.user.UserId);
  const loggedInRecruiter = useSelector((state: RootState) => state.recruiter.UserId);
  console.log("LOGGG",loggedInRecruiter);
  
  const fetchUserProfile = async () => {
    try {
      const response = await axiosUserInstance.get(`/getuser/${id}`);
      console.log("SFDss",response.data);
      
      setUserDetails(response.data.response);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
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

  const handleBannerFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedBannerFile(event.target.files[0]);
      setIsBannerModalOpen(true);
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
      console.log("RESP",response.data.updateUser.avatar);
      
      setUserDetails((prevDetails: any) => ({
        ...prevDetails,
        avatar: response.data.updateUser.avatar,
      }));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  const fetchUserPosts = async () => {
    try {
      const response = await axiosUserInstance.get(`/getpost/${id}`);
      console.log("RESPAS",response.data.posts);
      
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };
  const handleBannerUpload=async ()=>{
    console.log("ASD");
    console.log("SALA",selectedBannerFile);
    
    if (!selectedBannerFile) return;

    const formData = new FormData();
    formData.append('banner', selectedBannerFile);
    console.log("FORM",formData);
    
    try {
      const response = await axiosUserInstance.put(`/updateBanner/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("RESP",response.data.updateUser.banner);
      
      setUserDetails((prevDetails: any) => ({
        ...prevDetails,
        avatar: response.data.updateUser.banner,
      }));
      setIsBannerModalOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  const handleFollow = async () => {
    try {
      await axiosUserInstance.get(`/follow/${loggedInUserId}/${id}`);
      fetchUserProfile();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };
  const handleFollower = async () => {
    try {
      await axiosUserInstance.get(`/follow/${loggedInRecruiter}/${id}`);
      fetchUserProfile();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosUserInstance.get(`/unfollow/${loggedInUserId}/${id}`);
      fetchUserProfile(); 
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };
  const handleUnfollower = async () => {
    try {
      await axiosUserInstance.get(`/unfollow/${loggedInRecruiter}/${id}`);
      fetchUserProfile(); 
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };
  const handleFollowersClick = () => {
    try {
      setIsFollowersModalOpen(true);
      setModalUserIds(userDetails?.followers || []);
      setModalTitle('Followers');
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
};
const handleFollowingClick = () => {
  try {
    setIsFollowingModalOpen(true);
    setModalUserId(userDetails?.following || []);
    setModalTitles('Followings');
  } catch (error) {
    console.error('Error fetching following:', error);
  }
    
};

  
  
  const handleCreatechat=async ()=>{
    try {
      await axiosUserInstance.get(`createchat/${loggedInUserId}/${id}`)
      fetchUserProfile();
      navigate('/chat')
    } catch (error) {
      console.error('Error creating chat user:', error);
    }
  }
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'beige' }}>
    
    <div className="w-full max-w-5xl p-6 ml-0 lg:ml-[230px]">
      <Box 
  sx={{
    p: { xs: 2, sm: 3, md: 4 },  
    borderRadius: 2,
    boxShadow: 3,
    bgcolor: 'background.paper',
    mb: 4,
    width: { xs: '90%', sm: '80%', md: '70%', lg: '100%' },  
    mx: 'auto', 
  }}
>
  {userDetails && (
    <div style={{ position: 'relative' }}>
      <input
        accept="image/*"
        type="file"
        id="banner-upload"
        style={{ display: 'none' }}
        onChange={handleBannerFileChange}
      />
      <img
        src={userDetails.banner}
        alt="Banner"
        style={{ width: '100%', height: 'auto', objectFit: 'cover', maxHeight: '200px' }}
      />
      {id === loggedInUserId && (
        <PencilIcon
          className="w-5 h-5 text-green-500 bg-white rounded-full border-2 border-white cursor-pointer"
          style={{ position: 'absolute', bottom: '10px', right: '10px' }}
          onClick={() => document.getElementById('banner-upload')?.click()}
        />
      )}
    </div>
  )}
  {userDetails && (
    <div className="relative flex items-start">
      <div className="absolute -top-[25%] transform -translate-y-1/2 left-5 flex flex-col items-center mb-6">
        <div className="relative">
          <img src={userDetails?.avatar} alt="Avatar" className="w-20 h-20 rounded-full mb-2 border-2 border-white" />
          {id === loggedInUserId && (
            <PlusCircleIcon
              className="w-5 h-5 absolute bottom-0 right-0 text-green-500 bg-white rounded-full border-2 border-white cursor-pointer"
              onClick={() => document.getElementById('avatar')?.click()}
            />
          )}
          <input
            type="file"
            id="avatar"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="ml-5 mt-4">
        <div className="flex items-center">
          <Typography variant="h5">{userDetails?.name}</Typography>
          {id === loggedInUserId && (
            <PencilIcon
              className="w-6 h-6 ml-2 text-gray-500 cursor-pointer"
              onClick={handleUpdateProfile}
            />
          )}
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
  {isBannerModalOpen && (
    <div>
      <button onClick={handleBannerUpload}>Upload Banner</button>
    </div>
  )}
  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-around' }} onClick={handleFollowingClick}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <PeopleOutlineIcon sx={{ mr: 1, color: 'black' }} />
      <Typography variant="subtitle1" sx={{ mr: 1 }}>
        Following
      </Typography>
      <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24, fontSize: '0.8rem' }}>
        {userDetails?.following.length || 0}
      </Avatar>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={handleFollowersClick}>
      <PersonAddIcon sx={{ mr: 1, color: 'black' }} />
      <Typography variant="subtitle1" sx={{ mr: 1 }}>
        Followers
      </Typography>
      <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24, fontSize: '0.8rem' }}>
        {userDetails?.followers.length || 0}
      </Avatar>
    </Box>
  </Box>

  {id !== loggedInUserId && id !== loggedInRecruiter && (
    <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
      {userDetails?.followers.includes(loggedInRecruiter) || userDetails?.followers.includes(loggedInUserId) ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddAlt1Icon />}
          onClick={loggedInUserId ? handleUnfollow : handleUnfollower}
          sx={{ textTransform: 'none', boxShadow: 3 }}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddAlt1Icon />}
          onClick={loggedInUserId ? handleFollow : handleFollower}
          sx={{ textTransform: 'none', boxShadow: 3 }}
        >
          Follow
        </Button>
      )}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<MessageIcon />}
        onClick={handleCreatechat}
        sx={{ textTransform: 'none', boxShadow: 3 }}
      >
        Message
      </Button>
    </Box>
  )}
</Box>


        {userDetails && (
          <>
            <Box
                 sx={{
                  p: { xs: 2, sm: 3, md: 4 }, 
                  borderRadius: 2,
                  boxShadow: 3,
                  bgcolor: 'background.paper',
                  mb: 4,
                  width: { xs: '90%', sm: '80%', md: '70%', lg: '100%' }, 
                  mx: 'auto', 
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
                    {id === loggedInUserId && (
                    <PencilIcon
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                      onClick={() => handleEditEducation(edu)}
                    />
                    )}
                  </div>
                ))
              ) : (
                <Typography variant="subtitle1" className="text-center">
                  No education details provided.
                </Typography>
              )}
               {id === loggedInUserId && (
              <PlusCircleIcon
                className="w-6 h-6 text-blue-500 cursor-pointer absolute right-4 bottom-4"
                onClick={handleAddEducation}
              />
               )}
            </Box>
            <Box
                 sx={{
                  p: { xs: 2, sm: 3, md: 4 }, 
                  borderRadius: 2,
                  boxShadow: 3,
                  bgcolor: 'background.paper',
                  mb: 4,
                  width: { xs: '90%', sm: '80%', md: '70%', lg: '100%' }, 
                  mx: 'auto', 
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
      {id === loggedInUserId && (
      <PencilIcon className="w-6 h-6 text-gray-500 cursor-pointer ml-2" onClick={() => handleEditExperience(exp)} />
      )}
    </div>
  ))
) : (
  <Typography variant="subtitle1" className="text-center">
    No experience details provided.
  </Typography>
)}

{id === loggedInUserId && (
              <PlusCircleIcon
                className="w-6 h-6 text-blue-500 cursor-pointer absolute right-4 bottom-4"
                onClick={handleAddExperience}
              />
)}
            </Box>
            <Box
              sx={{
                p: { xs: 2, sm: 3, md: 4 }, 
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: 'background.paper',
                mb: 4,
                width: { xs: '90%', sm: '80%', md: '70%', lg: '100%' }, 
                mx: 'auto', 
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
                    {id === loggedInUserId && (
                    <PencilIcon
                      className="w-5 h-5 text-gray-500 cursor-pointer"
                      onClick={() => handleEditSkill(skillObj)}
                    />
                    )}
                  </div>
                ))
              ) : (
                <Typography variant="subtitle1" className="text-center">
                  No skills provided.
                </Typography>
              )}
               {id === loggedInUserId && (
              <PlusCircleIcon
                className="w-6 h-6 text-blue-500 cursor-pointer absolute right-4 bottom-4"
                onClick={handleAddSkill}
              />
               )}
            </Box>
            <Box  sx={{
                p: { xs: 2, sm: 3, md: 4 }, 
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: 'background.paper',
                mb: 4,
                width: { xs: '90%', sm: '80%', md: '70%', lg: '100%' }, 
                mx: 'auto', 
                position: 'relative'
              }}>
            <Typography variant="h6" sx={{ marginBottom: '10px' }}>Posts</Typography>
      {posts.length > 0 ? (
        posts.slice(0, visiblePosts).map((post) => (
          <Box key={post._id} sx={{ marginBottom: '20px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', overflow: 'hidden', wordWrap: 'break-word', transition: 'all 0.3s ease-in-out', ':hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.24), 0 4px 8px rgba(0,0,0,0.22)' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Avatar src={userDetails?.avatar} alt="User Avatar" sx={{ marginRight: '10px' }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{userDetails.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              {id === loggedInUserId && (

              <Box sx={{ marginLeft: 'auto', position: 'relative' }}>
              <Typography onClick={() => toggleOptions(post._id)} sx={{ cursor: 'pointer' }}>...</Typography>
              {showOptions[post._id] && (
                <Box sx={{ position: 'absolute', right: 0, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', zIndex: 1 }}>
                  <Typography sx={{ padding: '8px', cursor: 'pointer' }} onClick={() => { handleEdit(post); toggleOptions(post._id); }}>Edit</Typography>
                  <Typography sx={{ padding: '8px', cursor: 'pointer' }} onClick={() => { handleDelete(post._id); toggleOptions(post._id); }}>Delete</Typography>
                </Box>
              )}
              </Box>
              )}
            </Box>
            <Typography variant="body1" sx={{ fontSize: '14px', marginBottom: '10px' }}>
              {post.description}
            </Typography>
            <img src={post.image} alt={post.description} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
          </Box>
        ))
      ) : (
        <Typography variant="body1">No posts available.</Typography>
      )}
      {visiblePosts < posts.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          <Button onClick={showMorePosts} sx={{ textTransform: 'none', color: '#1976d2', fontWeight: 'bold', fontSize: '16px' }}>
            Show all posts <ArrowForwardIcon sx={{ marginLeft: '8px' }} />
          </Button>
        </Box>
      )}
    </Box>
  
          </>
        )}
      </div>
      <EducationModal
        open={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        userId={id ?? ''} 
        fetchProfileData={fetchUserProfile}
      />
      <ExperienceModal
        open={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        userId={id ?? ''} 
        fetchProfileData={fetchUserProfile}
      />
       <SkillModal
        open={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        userId={id ?? ''} 
        fetchProfileData={fetchUserProfile}
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
         <PostEditModal
          open={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          fetchProfileData={fetchUserProfile}
          postDetails={selectedPost}
          onPostUpdated={handlePostUpdated}
        />
              <Modal
            isOpen={isFollowingModalOpen}
            onClose={() => setIsFollowingModalOpen(false)}
            userIds={modalUserId}
            title={modalTitles}
            />
              <Modal
            isOpen={isFollowersModalOpen}
            onClose={() => setIsFollowersModalOpen(false)}
            userIds={modalUserIds}
            title={modalTitle}
            />
    </Box>
  );
}

export default Profile;
